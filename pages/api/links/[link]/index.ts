import { createRouter as nextConnect } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../../repositories/prisma/prisma-link-repository";

export default nextConnect<NextApiRequest, NextApiResponse>()
    .get(getHandler)
    .delete(deleteHandler)
    .handler({});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
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

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
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
