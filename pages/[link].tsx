import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { log } from "next-axiom";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PrismaLinkRepository } from "../repositories/prisma/prisma-link-repository";
import { api } from "../utils/api";

export default function Page({
    error,
    isPasswordProtected,
    link,
    ogTitle,
    ogType,
    ogImage,
    ogUrl,
    ogDescription,
    twitterCard,
    ogVideo,
    ogSiteName,
    ogLocale,
    redirectUrl,
}: {
    error?: string;
    isPasswordProtected?: boolean;
    link?: string;
    ogTitle?: string;
    ogType?: string;
    ogImage?: string;
    ogUrl?: string;
    ogDescription?: string;
    twitterCard?: string;
    ogVideo?: string;
    ogSiteName?: string;
    ogLocale?: string;
    redirectUrl?: string;
}) {
    const [password, setPassword] = useState("");

    const router = useRouter();

    function handleSubmitPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        api.post(`/links/${link}`, { password })
            .then((res) => {
                setPassword("");
                if (res.status === 200) router.push(res.data.redirectTo);
            })
            .catch((err) => {
                setPassword("");
                if (err.response.status === 401) {
                    alert("Wrong password");
                }
            });
    }
    useEffect(() => {
        if (
            ogTitle ||
            ogType ||
            ogImage ||
            ogUrl ||
            ogDescription ||
            twitterCard ||
            ogVideo ||
            ogSiteName ||
            ogLocale
        ) {
            router.push(redirectUrl);
        }
    });

    if (error) {
        return (
            <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
                <h1 className="text-6xl font-extrabold text-red-700">Error</h1>
                <span className="text-2xl font-semibold">
                    Try again later. If this error persists, contact support
                </span>
            </div>
        );
    } else if (isPasswordProtected) {
        return (
            <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
                <Head>
                    <title>
                        {ogTitle
                            ? `Password protected - ${ogTitle}`
                            : "Password protected"}
                    </title>
                    {ogTitle && (
                        <meta
                            property="og:title"
                            content={`Password protected - ${ogTitle}`}
                        />
                    )}
                    {ogType && <meta property="og:type" content={ogType} />}
                    {ogImage && <meta property="og:image" content={ogImage} />}
                    {ogUrl && <meta property="og:url" content={ogUrl} />}
                    {ogDescription && (
                        <meta
                            property="og:description"
                            content={ogDescription}
                        />
                    )}
                    {twitterCard && (
                        <meta property="twitter:card" content={twitterCard} />
                    )}
                    {ogVideo && <meta property="og:video" content={ogVideo} />}
                    {ogSiteName && (
                        <meta property="og:site_name" content={ogSiteName} />
                    )}
                    {ogLocale && (
                        <meta property="og:locale" content={ogLocale} />
                    )}
                </Head>

                <h1 className="text-6xl font-extrabold text-red-700">
                    Password Protected
                </h1>
                <span className="text-2xl font-semibold">
                    This link is password protected. Please enter the password
                    to continue.
                </span>
                <form
                    onSubmit={handleSubmitPassword}
                    className="grid grid-rows-3 gap-4 dark:border-zinc-800 border-zinc-400 p-5 rounded-md border-4"
                >
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                    />
                    <button
                        type="submit"
                        className="dark:bg-slate-700 bg-slate-400 rounded-md transition-colors ease-in-out"
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    } else if (
        ogTitle ||
        ogType ||
        ogImage ||
        ogUrl ||
        ogDescription ||
        twitterCard ||
        ogVideo ||
        ogSiteName ||
        ogLocale
    ) {
        return (
            <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
                <Head>
                    <title>{ogTitle}</title>
                    {ogTitle && <meta property="og:title" content={ogTitle} />}
                    {ogType && <meta property="og:type" content={ogType} />}
                    {ogImage && <meta property="og:image" content={ogImage} />}
                    {ogUrl && <meta property="og:url" content={ogUrl} />}
                    {ogDescription && (
                        <meta
                            property="og:description"
                            content={ogDescription}
                        />
                    )}
                    {twitterCard && (
                        <meta property="twitter:card" content={twitterCard} />
                    )}
                    {ogVideo && <meta property="og:video" content={ogVideo} />}
                    {ogSiteName && (
                        <meta property="og:site_name" content={ogSiteName} />
                    )}
                    {ogLocale && (
                        <meta property="og:locale" content={ogLocale} />
                    )}
                </Head>
            </div>
        );
    }
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
            return process.env.RICK
                ? {
                      redirect: {
                          destination:
                              "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                          permanent: true,
                      },
                  }
                : {
                      notFound: true,
                  };
        }

        if (dbRes.password) {
            return {
                props: {
                    isPasswordProtected: true,
                    link: dbRes.name,
                    ogTitle: dbRes.ogTitle,
                    ogType: dbRes.ogType,
                    ogImage: dbRes.ogImage,
                    ogUrl: dbRes.ogUrl,
                    ogDescription: dbRes.ogDescription,
                    twitterCard: dbRes.twitterCard,
                    ogVideo: dbRes.ogVideo,
                    ogSiteName: dbRes.ogSiteName,
                    ogLocale: dbRes.ogLocale,
                },
            };
        }

        if (
            dbRes.ogTitle ||
            dbRes.ogType ||
            dbRes.ogImage ||
            dbRes.ogUrl ||
            dbRes.ogDescription ||
            dbRes.twitterCard ||
            dbRes.ogVideo ||
            dbRes.ogSiteName ||
            dbRes.ogLocale
        ) {
            return {
                props: {
                    redirectUrl: dbRes.redirectTo,
                    ogTitle: dbRes.ogTitle,
                    ogType: dbRes.ogType,
                    ogImage: dbRes.ogImage,
                    ogUrl: dbRes.ogUrl,
                    ogDescription: dbRes.ogDescription,
                    twitterCard: dbRes.twitterCard,
                    ogVideo: dbRes.ogVideo,
                    ogSiteName: dbRes.ogSiteName,
                    ogLocale: dbRes.ogLocale,
                },
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
