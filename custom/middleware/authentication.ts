import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { PrismaSessionRepository } from "../../repositories/prisma/prisma-session-repository";
import { MetadataUser, NextApiRequestWithMetadata } from "../../types";

export async function injectAnonymousOrUser(
    req: NextApiRequestWithMetadata,
    res: NextApiResponse,
    next: NextHandler
) {
    if (req.cookies.session) {
        req.metadata = {
            ...req.metadata,
            user: await injectUser(req.cookies.session),
        };
    } else {
        req.metadata = {
            ...req.metadata,
            user: {},
        };
    }

    async function injectUser(session: string): Promise<MetadataUser> {
        const sessionRepository = new PrismaSessionRepository();

        const { user } = await sessionRepository.read({
            where: {
                session,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (user) {
            return {
                id: user.id,
                name: user.name,
            };
        } else {
            return {};
        }
    }

    await next();
}
