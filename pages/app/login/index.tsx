import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { XCircle } from "phosphor-react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setDialogOpen(true);
            setErrorMessage("Please fill in all fields");
            return;
        }

        window.localStorage.setItem("isLoggedIn", "true");

        async () => {
            await api.post("/sessions", {
                email,
                password,
                stayLoggedIn,
            });

            router.push("/app");
        };
    };

    return (
        <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
            <h1 className="text-3xl">Admin Login</h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-rows-4 gap-4 dark:border-zinc-800 border-zinc-400 p-5 rounded-md border-4"
            >
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm border-zinc-700 hover:bg-zinc-500 focus:border-zinc-500 focus:bg-zinc-700 focus:outline-none invalid:border-red-700 border-2"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                />
                <div className="flex justify-between">
                    <label htmlFor="stayLoggedIn">Stay logged in</label>
                    <input
                        id="stayLoggedIn"
                        type="checkbox"
                        checked={stayLoggedIn}
                        onChange={(e) => setStayLoggedIn(e.target.checked)}
                    />
                </div>
                <button
                    type="submit"
                    className="dark:bg-slate-700 bg-slate-400 rounded-md transition-colors ease-in-out"
                >
                    Login
                </button>
            </form>

            <dialog
                open={dialogOpen}
                onClick={() => {
                    setDialogOpen(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setDialogOpen(false);
                    } else if (e.key === "Escape") {
                        setDialogOpen(false);
                    }
                }}
                className="w-screen h-screen bg-opacity-50 bg-black"
            >
                <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
                    <div className="dark:bg-zinc-700 gap-2 dark:text-zinc-300 rounded-md border-zinc-700 p-5 grid grid-rows-2 place-items-center">
                        <h1 className="text-red-600 font-bold text-xl">
                            {errorMessage}
                        </h1>

                        <XCircle size={32} color="#71717a" weight="bold" />
                    </div>
                </div>
            </dialog>
        </div>
    );
}
