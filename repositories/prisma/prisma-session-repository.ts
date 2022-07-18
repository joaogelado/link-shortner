import { prisma } from "../../utils/prisma";
import {
    Session,
    SessionCreateData,
    SessionDeleteData,
    SessionReadData,
    SessionRepository,
    SessionUpdateData,
} from "../session-repository";

export class PrismaSessionRepository implements SessionRepository {
    async create({ data }: SessionCreateData) {
        await prisma.session.create({
            data,
        });
    }

    async update({ data, where }: SessionUpdateData) {
        await prisma.session.update({
            data,
            where,
        });
    }

    async delete({ where }: SessionDeleteData) {
        await prisma.session.delete({
            where,
        });
    }

    async read({ where, select }: SessionReadData): Promise<Session | null> {
        if (where.id) {
            const session = await prisma.session.findUnique({
                where: {
                    id: where.id,
                },
                select,
            });

            return Promise.resolve(session);
        } else if (where.session) {
            const session = await prisma.session.findUnique({
                where: {
                    session: where.session,
                },
                select,
            });

            return Promise.resolve(session);
        } else if (where.user) {
            const session = await prisma.session.findUnique({
                where: {},
                select,
            });

            return Promise.resolve(session);
        } else {
            return Promise.resolve(null);
        }
    }
}
