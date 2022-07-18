import { NextApiResponse } from "next";
import { createRouter as nextConnect } from "next-connect";
import { injectAnonymousOrUser } from "../../../../custom/middleware/authentication";
import { PrismaUserRepository } from "../../../../repositories/prisma/prisma-user-repository";
import { NextApiRequestWithMetadata } from "../../../../types";

export default nextConnect()
    .use(injectAnonymousOrUser)
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

    const { user } = req.query;

    const dbRes = await userRepository.read({
        where: {
            name: user as string,
        },
        select: {
            createdAt: true,
            id: true,
            name: true,
            updatedAt: true,
        },
    });

    if (!dbRes) {
        return res
            .status(404)
            .json({ message: "User not found", statusCode: 404 });
    }

    res.status(200).json(dbRes);
}
