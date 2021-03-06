import { NextApiResponse } from "next";
import { createRouter as nextConnect } from "next-connect";
import { injectAnonymousOrUser } from "../../../custom/middleware/authentication";
import { PrismaSessionRepository } from "../../../repositories/prisma/prisma-session-repository";
import { NextApiRequestWithMetadata } from "../../../types";

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

    const session = req.cookies.session;

    const sessionRepository = new PrismaSessionRepository();

    const user = await sessionRepository.read({
        where: {
            session: session,
        },
        select: {
            createdAt: true,
            id: true,
            session: true,
            user: {
                select: {
                    createdAt: true,
                    email: true,
                    id: true,
                    name: true,
                    updatedAt: true,
                },
            },
        },
    });

    if (!user) {
        res.status(401).json({
            message: "Your session is not correct",
            statusCode: 401,
        });
        return;
    }

    return res.status(200).json({
        statusCode: 200,
        data: user,
    });
}
