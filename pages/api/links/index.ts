import { createRouter as nextConnect } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../repositories/prisma/prisma-link-repository";

export default nextConnect<NextApiRequest, NextApiResponse>()
    .get(getHandler)
    .post(postHandler)
    .handler({});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const linkRepository = new PrismaLinkRepository();

    const links = await linkRepository.readAll({});

    return res.json(links);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { name, redirectTo }: { name: string; redirectTo: string } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required",
            statusCode: 400,
        });
    }

    if (!redirectTo) {
        return res.status(400).json({
            message: "Redirect URL is required",
            statusCode: 400,
        });
    }

    if (name.startsWith("app")) {
        return res.status(400).json({
            message: "Name cannot start with 'app'",
            statusCode: 400,
        });
    }

    if (name.includes("/")) {
        return res.status(400).json({
            message: "Name cannot contain '/'",
            statusCode: 400,
        });
    }

    const linkRepository = new PrismaLinkRepository();

    await linkRepository.create({
        name: req.body.name,
        redirectTo: req.body.redirectTo,
    });

    return res.json({
        success: true,
    });
}
