import { createRouter as nextConnect } from "next-connect";
import { NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../../repositories/prisma/prisma-link-repository";
import { NextApiRequestWithMetadata } from "../../../../types";
import { injectAnonymousOrUser } from "../../../../custom/middleware/authentication";

export default nextConnect<NextApiRequestWithMetadata, NextApiResponse>()
    .use(injectAnonymousOrUser)
    .get(getHandler)
    .delete(deleteHandler)
    .handler({});

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

    const linkRepository = new PrismaLinkRepository();

    const link = await linkRepository.read({
        where: {
            name: req.query.link as string,
        },
    });

    if (!link) {
        return res.status(404).json({
            message: "Link not found",
            statusCode: 404,
        });
    }

    if (!req.query.noClick) {
        linkRepository.update({
            where: {
                id: link.id,
            },
            data: {
                clicks: link.clicks + 1,
            },
        });
    }

    return res.json(link);
}

async function deleteHandler(
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

    const { link } = req.query;

    if (!link) {
        return res.status(400).json({
            message: "Link is required",
            statusCode: 400,
        });
    }

    try {
        const linkRepository = new PrismaLinkRepository();

        await linkRepository.delete({
            where: {
                name: link as string,
            },
        });

        return res.json({
            success: true,
        });
    } catch (err) {
        if (err.code == "P2025") {
            return res.status(404).json({
                message: "Link not found",
                statusCode: 400,
            });
        }
    }
}
