import axios from "axios"

export const api = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? `${process.env.VERCEL_URL}/api` : "http://localhost:3000/api"
})
