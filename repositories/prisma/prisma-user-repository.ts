import { prisma } from "../../utils/prisma";
import {
    User,
    UserCreateData,
    UserDeleteData,
    UserReadAllData,
    UserReadData,
    UserRepository,
    UserUpdateData,
} from "../user-repository";

export class PrismaUserRepository implements UserRepository {
    async create({ data }: UserCreateData) {
        await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            },
        });
    }

    async update({ data, where }: UserUpdateData) {
        await prisma.user.update({
            data,
            where,
        });
    }

    async delete({ where }: UserDeleteData) {
        await prisma.user.delete({
            where,
        });
    }

    async read({ where, select }: UserReadData): Promise<User | null> {
        if (where.id) {
            const user = await prisma.user.findUnique({
                where: {
                    id: where.id,
                },
                select,
            });

            return Promise.resolve(user);
        } else if (where.email) {
            const user = await prisma.user.findUnique({
                where: {
                    email: where.email,
                },
                select,
            });

            return Promise.resolve(user);
        } else if (where.name) {
            const user = await prisma.user.findUnique({
                where: {
                    name: where.name,
                },
                select,
            });

            return Promise.resolve(user);
        } else {
            return Promise.resolve(null);
        }
    }

    async readAll({
        where,
        orderBy,
        select,
    }: UserReadAllData): Promise<User[] | null> {
        const users = await prisma.user.findMany({
            where,
            select,
            orderBy,
        });

        if (!users) return Promise.resolve(null);

        return Promise.resolve(users);
    }
}
