import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if (request.url.includes("/login")) {
        return NextResponse.next();
    } else {
        if (!request.cookies.get("session")) {
            return NextResponse.rewrite(new URL("/app/login", request.url));
        }
    }
}

export const config = {
    matcher: "/app/:path*",
};
