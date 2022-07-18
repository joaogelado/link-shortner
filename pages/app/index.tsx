import { useRouter } from "next/router";
import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "../../components/Loading";

import { api } from "../../utils/api";

const LinkList = lazy(() => import("../../components/LinkList"));

export default function Dashboard() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            if (window.localStorage.getItem("isLoggedIn") !== "true") {
                router.push("/app/login", "/app");
                return;
            }

            (async () => {
                try {
                    await api.get("/user");
                    setLoading(false);
                } catch (err) {
                    if (err.response.status === 401) {
                        router.push("/app/login", "/app");
                    }
                }
            })();
        } catch (err) {
            console.error(err);

            router.push("/app/login", "/app");
        }
    }, [router]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="grid my-7 place-items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Suspense fallback={<Loading />}>
                        <LinkList></LinkList>
                    </Suspense>
                </div>
            )}
        </>
    );
}
