import { prisma } from "../../utils/prisma";
import {
    CreateLinkData,
    DeleteLinkData,
    Link,
    LinkRepository,
    ReadAllLinkData,
    ReadLinkData,
    UpdateLinkData,
} from "../link-repository";

export class PrismaLinkRepository implements LinkRepository {
    async readAll({
        orderBy,
        select,
        where,
    }: ReadAllLinkData): Promise<Link[]> {
        const res = await prisma.link.findMany({
            where,
            select,
            orderBy,
        });

        return res;
    }

    async read({ where, select }: ReadLinkData): Promise<Link> {
        const res = await prisma.link.findUnique({
            where,
            select,
        });

        return res;
    }

    async create({ name }: CreateLinkData): Promise<void> {
        await prisma.link.create({
            data: {
                name,
            },
        });
    }

    async update({ where, data }: UpdateLinkData): Promise<void> {
        await prisma.link.update({
            where,
            data,
        });
    }

    async delete({ where }: DeleteLinkData): Promise<void> {
        await prisma.link.delete({
            where,
        });
    }
}
