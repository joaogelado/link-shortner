import axios from "axios";

export const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? `${process.env.DEPLOY_URL ?? ""}/api` // little check to see if it is on server (no relative URLs) or client (relative URLs)
            : "http://localhost:3000/api",
});
