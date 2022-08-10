import useSWR from "swr";
import NextLink from "next/link";
import { api } from "../utils/api";
import Loading from "./Loading";
import { useRouter } from "next/router";

import { Link } from "phosphor-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function LinkList() {
    const router = useRouter();

    const { data, error } = useSWR("/links", fetcher, {
        refreshInterval: 500,
    });

    if (error && error.response.status === 401) {
        router.push("/app/login", "/app");
    }

    return (
        <>
            <NextLink href="/app/create">
                <a>
                    <Link />
                </a>
            </NextLink>

            <div className="divide-y divide-zinc-400 dark:divide-zinc-800">
                {data ? (
                    data.map((link) => (
                        <div key={link.id} className="grid grid-rows-3 p-5">
                            <span>
                                Original URL:{" "}
                                <NextLink href={`/${link.name}`}>
                                    <a className="text-blue-300">
                                        {`${
                                            window.location.host.includes(
                                                "localhost" // if the host is localhost, we use http, everything else we use https
                                            )
                                                ? "http"
                                                : "https"
                                        }://${window.location.host}/${
                                            link.name
                                        }`}
                                    </a>
                                </NextLink>
                            </span>
                            <span>Redirect URL: {link.redirectTo}</span>
                            <span>Clicks: {link.clicks}</span>
                            <span>
                                Is password locked?{" "}
                                {link.isPasswordLocked ? "Yes" : "No"}
                            </span>
                            {link.ogTitle && (
                                <span>og:title: {link.ogTitle}</span>
                            )}
                        </div>
                    ))
                ) : (
                    <Loading />
                )}
                {error && (
                    <div className="grid grid-rows-2 place-items-center">
                        <span className="text-red-500">
                            Error trying to read links: {error.message}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
