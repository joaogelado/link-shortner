import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { log } from "next-axiom";
import { api } from "../utils/api";

export default function Page({ error }: { error: AxiosError }) {
    return (
        <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
            <h1 className="text-6xl font-extrabold text-red-700">
                {Number(error.status) == 404 ? "Not found" : "Error"}
            </h1>
            <span className="text-2xl font-semibold">
                {Number(error.status) == 404
                    ? "Try checking the URL"
                    : "Try again later. If this error persists, contact support"}
            </span>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const link = context.params.link;

    try {
        const res = await api.get(`/links/${link}`);

        log.debug("getServerSideProps fetch res", res);
        console.log("getServerSideProps fetch res", res);

        return {
            redirect: {
                destination: res.data.redirectTo,
                permanent: true,
            },
        };
    } catch (error) {
        log.error("getServerSideProps fetch error", error);
        console.error("getServerSideProps fetch error", error);

        if (error instanceof AxiosError) {
            return {
                props: {
                    // We have to do this to eliminate any undefined variables
                    error: JSON.parse(JSON.stringify(error.toJSON())),
                },
            };
        }
    }
};
