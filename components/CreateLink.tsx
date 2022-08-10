import { useState } from "react";

import { ArrowLeft } from "phosphor-react";

import { api } from "../utils/api";
import FormInput from "./FormInput";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CreateLink() {
    const [name, setName] = useState<string | null>("");
    const [redirectTo, setRedirectTo] = useState("");
    const [password, setPassword] = useState("");
    const [ogTitle, setOgTitle] = useState("");
    const [ogType, setOgType] = useState("");
    const [ogImage, setOgImage] = useState("");
    const [ogUrl, setOgUrl] = useState("");
    const [ogDescription, setOgDescription] = useState("");
    const [twitterCard, setTwitterCard] = useState("");
    const [ogVideo, setOgVideo] = useState("");
    const [ogSiteName, setOgSiteName] = useState("");
    const [ogLocale, setOgLocale] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const router = useRouter();

    async function handleCreateLink(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(ogTitle);

        await api.post("/links", {
            name,
            redirectTo,
            password,
            ogTitle,
        });

        router.push("/app");
    }

    return (
        <div className="grid gap-7 my-7 w-screen">
            <h1 className="text-3xl place-self-center ">Create Link</h1>
            {/* <div className="grid place-self-center grid-cols-2 place-content-evenly w-1/2"> */}
            {/* </div> */}
            <Link href="/">
                <a className="place-self-center">
                    <ArrowLeft
                        size={30}
                        aria-label="Go back..."
                        color="#515159"
                    />
                </a>
            </Link>
            <form
                onSubmit={handleCreateLink}
                className="grid place-self-center grid-rows-6 gap-4 dark:border-zinc-800 border-zinc-400 p-5 rounded-md border-4"
            >
                <FormInput
                    label="Name"
                    placeholder="Enter the link's name..."
                    required
                    setState={setName}
                    state={name}
                    id="name"
                />
                <FormInput
                    label="Redirect to"
                    placeholder="Enter the link's redirect link..."
                    required
                    setState={setRedirectTo}
                    state={redirectTo}
                    id="redirectTo"
                    type="url"
                />
                <FormInput
                    label="Password"
                    placeholder="Enter the link's password..."
                    setState={setPassword}
                    state={password}
                    id="password"
                    type="password"
                />
                <hr className="dark:border-zinc-800 border-zinc-400" />
                <button
                    type="button"
                    onClick={() => {
                        setShowAdvanced((state) => {
                            !state
                                ? router.push("/app/create#advanced")
                                : router.push("/app/create");
                            return !state;
                        });
                    }}
                >
                    Show advanced options
                </button>
                {showAdvanced && (
                    <div className="grid gap-2" id="advanced">
                        <FormInput
                            label="og:title"
                            placeholder="Enter the link's OpenGraph title..."
                            setState={setOgTitle}
                            state={ogTitle}
                            id="ogTitle"
                            type="text"
                        />
                        <FormInput
                            label="og:type"
                            placeholder="Enter the link's OpenGraph type..."
                            setState={setOgType}
                            state={ogType}
                            id="ogType"
                            type="select"
                            options={[
                                {
                                    label: "website",
                                    value: "website",
                                },
                                {
                                    label: "article",
                                    value: "article",
                                },
                            ]}
                        />
                        <FormInput
                            label="og:url"
                            placeholder="Enter the link's OpenGraph URL..."
                            setState={setOgUrl}
                            state={ogUrl}
                            id="ogUrl"
                            type="url"
                        />
                        <FormInput
                            label="og:image"
                            placeholder="Enter the link's OpenGraph image URL..."
                            setState={setOgImage}
                            state={ogImage}
                            id="ogImage"
                            type="url"
                            disabled={
                                // this means that if ogVideo is not empty, then ogImage can't be filled
                                ogVideo === "" && ogImage === ""
                                    ? false
                                    : !!ogVideo
                            }
                        />
                        <FormInput
                            label="og:description"
                            placeholder="Enter the link's OpenGraph description..."
                            setState={setOgDescription}
                            state={ogDescription}
                            id="ogDescription"
                            type="text"
                        />
                        <FormInput
                            label="twitter:card"
                            placeholder="Enter the link's Twitter card..."
                            setState={setTwitterCard}
                            state={twitterCard}
                            id="twitterCard"
                            type="text"
                        />
                        <FormInput
                            label="og:video"
                            placeholder="Enter the link's OpenGraph video URL..."
                            setState={setOgVideo}
                            state={ogVideo}
                            id="ogVideo"
                            type="url"
                            disabled={
                                // this means that if ogVideo is not empty, then ogImage can't be filled
                                ogVideo === "" && ogImage === ""
                                    ? false
                                    : !!ogVideo
                            }
                        />
                        <FormInput
                            label="og:site_name"
                            placeholder="Enter the link's OpenGraph site name..."
                            setState={setOgSiteName}
                            state={ogSiteName}
                            id="ogSiteName"
                            type="text"
                        />
                        <FormInput
                            label="og:locale"
                            placeholder="Enter the link's OpenGraph locale..."
                            setState={setOgLocale}
                            state={ogLocale}
                            id="ogLocale"
                            type="text"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="dark:bg-slate-700 bg-slate-400 rounded-md transition-colors ease-in-out"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
