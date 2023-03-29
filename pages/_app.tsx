import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <title>O ASM</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
            <Toaster position="top-right" reverseOrder={false} />
        </React.Fragment>
    );
}
