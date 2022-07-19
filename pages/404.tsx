import { log } from "next-axiom";

export default function Page() {
    log.error("got 404 error");

    return (
        <div className="grid row-span-2 gap-10 content-center place-items-center h-screen">
            <h1 className="text-6xl font-extrabold text-red-700">Not found</h1>
            <span className="text-2xl font-semibold">
                Check the URL and try again
            </span>
        </div>
    );
}
