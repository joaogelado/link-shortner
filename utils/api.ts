import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
        ? `${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
        : "http://localhost:3000/api",
});
