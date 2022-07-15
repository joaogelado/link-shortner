import { createRouter as nextConnect } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../../repositories/prisma/prisma-link-repository";

export default nextConnect<NextApiRequest, NextApiResponse>()
    .get(getHandler)
    .handler({});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
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

        return res.json(link);
    }
}
