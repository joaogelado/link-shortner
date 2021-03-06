import { NextApiRequest, NextApiResponse } from "next";
import { createRouter as nextConnect } from "next-connect";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";
import { hash } from "bcrypt";
import { NextApiRequestWithMetadata } from "../../../types";
import { injectAnonymousOrUser } from "../../../custom/middleware/authentication";

export default nextConnect()
    .use(injectAnonymousOrUser)
    .post(postHandler)
    .get(getHandler)
    .handler();

async function getHandler(
    req: NextApiRequestWithMetadata,
    res: NextApiResponse
) {
    if (!req.metadata.user.id) {
        res.status(401).json({
            message: "You have to be logged in first",
            statusCode: 401,
        });
        return;
    }

    const userRepository = new PrismaUserRepository();

    const user = await userRepository.readAll({
        select: {
            createdAt: true,
            id: true,
            name: true,
            updatedAt: true,
        },
    });

    res.status(200).json(user);
}

async function postHandler(
    req: NextApiRequestWithMetadata,
    res: NextApiResponse
) {
    const { name, email, password } = req.body;

    if (process.env.PERMITTED_EMAIL !== email) {
        return res.status(403).json({});
    }

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "name, email, and password are required",
            statusCode: 400,
        });
    }

    const userRepository = new PrismaUserRepository();

    const hashedPassword = await hash(
        password,
        process.env.NODE_ENV === "production" ? 13 : 1
    );

    await userRepository.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    res.status(201).json({
        success: true,
    });
}
