import { createRouter as nextConnect } from "next-connect";
import { NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../../repositories/prisma/prisma-link-repository";
import { NextApiRequestWithMetadata } from "../../../../types";
import { injectAnonymousOrUser } from "../../../../custom/middleware/authentication";
import { compare } from "bcrypt";

export default nextConnect<NextApiRequestWithMetadata, NextApiResponse>()
    .use(injectAnonymousOrUser)
    .get(getHandler)
    .delete(deleteHandler)
    .post(postHandler)
    .handler({});

async function postHandler(
    req: NextApiRequestWithMetadata,
    res: NextApiResponse
) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    if (!req.body.password) {
        return res.status(400).json({
            message: "Password is required",
            statusCode: 400,
        });
    }

    const { password } = req.body;
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({
            message: "Link is required",
            statusCode: 400,
        });
    }

    const linkRepository = new PrismaLinkRepository();
    const dbRes = await linkRepository.read({
        where: {
            name: link as string,
        },
    });

    if (!dbRes) {
        await sleep(
            440 + Math.floor(Math.random() * Math.floor(Math.random() * 80))
        );

        return res.status(401).json({
            message: "Wrong password",
            statusCode: 401,
        });
    }

    if (!dbRes.password) {
        await sleep(
            440 + Math.floor(Math.random() * Math.floor(Math.random() * 80))
        );

        return res.status(401).json({
            message: "Wrong password",
            statusCode: 401,
        });
    }

    if (!(await compare(password, dbRes.password))) {
        return res.status(401).json({
            message: "Wrong password",
            statusCode: 401,
        });
    }

    res.status(200).json({
        redirectTo: dbRes.redirectTo,
    });
}

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
        select: {
            clicks: true,
            createdAt: true,
            id: true,
            ogTitle: true,
            name: true,
            redirectTo: true,
            password: true,
        },
    });

    if (!link) {
        return res.status(404).json({
            message: "Link not found",
            statusCode: 404,
        });
    }

    return res.json({
        clicks: link.clicks,
        createdAt: link.createdAt,
        id: link.id,
        name: link.name,
        ogTitle: link.ogTitle,
        redirectTo: link.redirectTo,
        isPasswordLocked: link.password ? true : false,
    });
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
