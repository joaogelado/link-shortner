import "../styles/global.css";
export { reportWebVitals } from 'next-axiom';

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
