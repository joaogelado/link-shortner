import { createRouter as nextConnect } from "next-connect";
import type { NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../repositories/prisma/prisma-link-repository";
import { injectAnonymousOrUser } from "../../../custom/middleware/authentication";
import { NextApiRequestWithMetadata } from "../../../types";
import slug from "slug";
import { generateRandomB64 } from "../../../utils/randomb64";

export default nextConnect<NextApiRequestWithMetadata, NextApiResponse>()
    .use(injectAnonymousOrUser)
    .get(getHandler)
    .post(postHandler)
    .handler({});

async function getHandler(
    req: NextApiRequestWithMetadata,
    res: NextApiResponse
) {
    if (!req.metadata.user.id) {
        return res.status(401).json({
            message: "You have to be logged in first",
            statusCode: 401,
        });
    }

    const linkRepository = new PrismaLinkRepository();

    const links = await linkRepository.readAll({});

    return res.json(links);
}

async function postHandler(
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

    const { name, redirectTo }: { name: string; redirectTo: string } = req.body;

    let changingName = name || null;

    if (!changingName) {
        changingName = generateRandomB64(12);
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

    const sluggedName = slug(changingName, { lower: true });

    const linkRepository = new PrismaLinkRepository();

    await linkRepository.create({
        name: sluggedName,
        redirectTo,
    });

    return res.json({
        success: true,
    });
}
