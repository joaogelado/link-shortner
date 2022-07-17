export default function Loading() {
    return (
        <div className="grid grid-rows-2 place-items-center">
            <span>Loading...</span>
            <div className="border-8 dark:border-zinc-300 dark:border-t-blue-700 border-zinc-300 h-9 w-9 rounded-full border-t-blue-300 animate-spin"></div>
        </div>
    );
}
