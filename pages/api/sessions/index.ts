import { NextApiRequest, NextApiResponse } from "next";
import { createRouter as nextConnect } from "next-connect";
import { compare } from "bcrypt";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";
import { PrismaSessionRepository } from "../../../repositories/prisma/prisma-session-repository";
import { randomBytes } from "crypto";
import { setCookie } from "nookies";

export default nextConnect().post(postHandler).get(getHandler).handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.cookies.session) {
        return res.status(401).json({
            error: "You must be logged in to access this resource",
        });
    }

    const sessionRepository = new PrismaSessionRepository();

    const session = await sessionRepository.read({
        where: {
            session: req.cookies.session,
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            id: true,
            session: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(200).json({
        success: true,
        data: session,
    });
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, stayLoggedIn } = req.body;

    if (process.env.PERMITTED_EMAIL !== email) {
        return res.status(403).json({});
    }

    if (!email || !password) {
        return res.status(400).json({
            message: "email and password are required",
            statusCode: 400,
        });
    }

    const userRepository = new PrismaUserRepository();
    const sessionRepository = new PrismaSessionRepository();

    const dbRes = await userRepository.read({
        where: {
            email,
        },
    });

    if (!dbRes) {
        return res.status(404).json({
            message: "user not found",
            statusCode: 404,
        });
    }

    const isValid = await compare(password, dbRes.password);

    if (!isValid) {
        return res.status(401).json({
            message: "invalid password",
            statusCode: 401,
        });
    }

    const session = randomBytes(64).toString("hex");

    await sessionRepository.create({
        data: {
            user: {
                connect: {
                    id: dbRes.id,
                },
            },
            session: session,
        },
    });

    setCookie(
        {
            res,
        },
        "session",
        session,
        {
            path: "/",
            maxAge: stayLoggedIn ? 60 * 60 * 24 * 7 : undefined,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        }
    );

    res.status(201).json({
        success: true,
    });
}
