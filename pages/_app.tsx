import type {AppProps} from 'next/app'
import '../styles/globals.css'
import React from "react";
import {useUser} from "../lib/hooks";
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
    let user = useUser();

    return (
        <>
            <Head>
                <meta name='viewport'
                      content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
                <title>SpotMyVaccine</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
