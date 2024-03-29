import { createRouter as nextConnect } from "next-connect";
import type { NextApiResponse } from "next";
import { PrismaLinkRepository } from "../../../repositories/prisma/prisma-link-repository";
import { injectAnonymousOrUser } from "../../../custom/middleware/authentication";
import { NextApiRequestWithMetadata } from "../../../types";
import slug from "slug";
import { generateRandomB64 } from "../../../utils/randomb64";
import { hash } from "bcrypt";

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

    const links = await linkRepository.readAll({
        select: {
            clicks: true,
            createdAt: true,
            id: true,
            ogTitle: true,
            ogDescription: true,
            ogImage: true,
            ogUrl: true,
            ogType: true,
            twitterCard: true,
            ogVideo: true,
            ogSiteName: true,
            ogLocale: true,
            name: true,
            redirectTo: true,
            password: true,
        },
    });

    return res.json(
        links.map((link) => {
            return {
                name: link.name,
                redirectTo: link.redirectTo,
                clicks: link.clicks,
                createdAt: link.createdAt,
                ogTitle: link.ogTitle,
                ogDescription: link.ogDescription,
                ogImage: link.ogImage,
                ogUrl: link.ogUrl,
                ogType: link.ogType,
                twitterCard: link.twitterCard,
                ogVideo: link.ogVideo,
                ogSiteName: link.ogSiteName,
                ogLocale: link.ogLocale,
                id: link.id,
                isPasswordLocked: link.password ? true : false,
            };
        })
    );
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

    const {
        name,
        redirectTo,
        password,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogType,
        twitterCard,
        ogVideo,
        ogSiteName,
        ogLocale,
    }: {
        name: string;
        redirectTo: string;
        password?: string;
        ogTitle?: string;
        ogDescription: string;
        ogImage: string;
        ogUrl: string;
        ogType: string;
        twitterCard: string;
        ogVideo: string;
        ogSiteName: string;
        ogLocale: string;
    } = req.body;

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

    let hashedPassword;

    if (password) {
        hashedPassword = await hash(
            password,
            process.env.NODE_ENV === "production" ? 13 : 1
        );
        console.log(hashedPassword);
    }

    await linkRepository.create({
        name: sluggedName,
        redirectTo,
        password: hashedPassword,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogType,
        twitterCard,
        ogVideo,
        ogSiteName,
        ogLocale,
    });

    return res.json({
        success: true,
    });
}
