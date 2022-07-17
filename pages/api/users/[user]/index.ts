import { NextApiRequest, NextApiResponse } from "next";
import { createRouter as nextConnect } from "next-connect";
import { PrismaUserRepository } from "../../../../repositories/prisma/prisma-user-repository";

export default nextConnect().get(getHandler).handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const userRepository = new PrismaUserRepository();

    const { user } = req.query;

    const dbRes = await userRepository.read({
        where: {
            name: user as string,
        },
        select: {
            createdAt: true,
            id: true,
            name: true,
            updatedAt: true,
        },
    });

    if (!dbRes) {
        return res
            .status(404)
            .json({ message: "User not found", statusCode: 404 });
    }

    res.status(200).json(dbRes);
}
