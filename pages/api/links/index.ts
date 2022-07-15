import { createRouter as nextConnect } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../repositories/prisma/prisma-link-repository";

export default nextConnect<NextApiRequest, NextApiResponse>()
    .get(getHandler)
    .handler({});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const linkRepository = new PrismaLinkRepository();

        const links = await linkRepository.readAll({});

        return res.json(links);
    }
}
