import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateLink from "../../../components/CreateLink";
import Loading from "../../../components/Loading";
import { api } from "../../../utils/api";

export default function Create() {
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

    if (loading) {
        return <Loading />;
    }

    return <CreateLink />;
}
