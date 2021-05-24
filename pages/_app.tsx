import type {AppProps} from 'next/app'
import '../styles/globals.css'
import React, {useEffect} from "react";
import Head from "next/head";
import {initFCM} from '../lib/fcmUtils'
import * as ga from '../lib/ga'
import {useRouter} from "next/router";

function MyApp({Component, pageProps}: AppProps) {
    async function saveFCMToken(token) {
        try {
            await fetch(`/api/fcm/update`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify({
                    fcmToken: token,
                })
            })
        } catch (e) {
            //console.log(e.message)
        }
    }

    useEffect(() => {
        initFCM(saveFCMToken, () => {
        })
    }, [])

    const router = useRouter()

    useEffect(() => {
        const handleRouteChange = (url) => {
            ga.pageview(url)
        }
        //When the component is mounted, subscribe to router changes
        //and log those page views
        router.events.on('routeChangeComplete', handleRouteChange)

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])
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
