import { Html, Main, NextScript, Head } from "next/document";

export default function Document() {
    return (
        <Html className="dark:bg-zinc-900 dark:text-zinc-50 scroll-smooth">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <meta name="robots" content="noindex" />
                <meta name="robots" content="nofollow" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
