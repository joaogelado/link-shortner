import { useState } from "react";

import { Link } from "phosphor-react";
import { api } from "../utils/api";

export default function CreateLink() {
    const [name, setName] = useState<string | null>("");
    const [redirectTo, setRedirectTo] = useState("");
    const [password, setPassword] = useState("");
    const [ogTitle, setOgTitle] = useState("");
    const [isSelected, setIsSelected] = useState(false);

    function handleOpenCreateLink() {
        setIsSelected(true);
    }

    async function handleCreateLink(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(ogTitle);

        await api.post("/links", {
            name,
            redirectTo,
            password,
            ogTitle,
        });

        setIsSelected(false);
    }

    if (!isSelected) {
        return (
            <button
                onClick={handleOpenCreateLink}
                className="grid grid-rows-1 p-5"
            >
                <Link />
            </button>
        );
    }

    return (
        <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
            <h1 className="text-3xl">Create Link</h1>
            <form
                onSubmit={handleCreateLink}
                className="grid grid-rows-4 gap-4 dark:border-zinc-800 border-zinc-400 p-5 rounded-md border-4"
            >
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm border-zinc-700 hover:bg-zinc-500 focus:border-zinc-500 focus:bg-zinc-700 focus:outline-none invalid:border-red-700 border-2"
                />
                <label htmlFor="redirectTo">Redirect To</label>
                <input
                    id="redirectTo"
                    type="text"
                    value={redirectTo}
                    required
                    onChange={(e) => setRedirectTo(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                />
                <hr />
                <label htmlFor="ogTitle">og:title</label>
                <input
                    id="ogTitle"
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                />
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
