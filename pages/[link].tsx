import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { log } from "next-axiom";
import { PrismaLinkRepository } from "../repositories/prisma/prisma-link-repository";

export default function Page() {
    return (
        <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
            <h1 className="text-6xl font-extrabold text-red-700">Error</h1>
            <span className="text-2xl font-semibold">
                Try again later. If this error persists, contact support
            </span>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const link = context.params.link;

    try {
        const linkRepository = new PrismaLinkRepository();

        const dbRes = await linkRepository.read({
            where: {
                name: link as string,
            },
        });

        if (!!dbRes) {
            await linkRepository.update({
                where: {
                    name: link as string,
                },
                data: {
                    clicks: dbRes.clicks + 1,
                },
            });
        } else {
            return {
                notFound: true,
            };
        }

        return {
            redirect: {
                destination: dbRes.redirectTo,
                permanent: true,
            },
        };
    } catch (error) {
        log.error("got server side props error", error);

        if (error instanceof PrismaClientKnownRequestError) {
            return {
                props: {
                    error: "database error",
                },
            };
        } else {
            return {
                props: {
                    error: "unknown error",
                },
            };
        }
    }
};
