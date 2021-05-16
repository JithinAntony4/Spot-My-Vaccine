import React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {createMuiTheme, ServerStyleSheets} from '@material-ui/core/styles';

const theme = createMuiTheme({});

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name='application-name' content='SpotMyVaccine'/>
                    <meta name='apple-mobile-web-app-capable' content='yes'/>
                    <meta name='apple-mobile-web-app-status-bar-style' content='default'/>
                    <meta name='apple-mobile-web-app-title' content='SpotMyVaccine'/>
                    <meta name='description'
                          content='SpotMyVaccine is platform for getting real-time updates about vaccines in India.'/>
                    <meta name='format-detection' content='telephone=no'/>
                    <meta name='mobile-web-app-capable' content='yes'/>
                    <meta name="theme-color" content={theme.palette.primary.main}/>

                    <link rel='apple-touch-icon' href='/images/apple-touch-icon.png'/>
                    <link rel="manifest" href="/manifest.json"/>
                    <link rel="icon" href="/images/icon-192x192.png"/>
                    <link rel="stylesheet"
                          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>

                    <meta name='twitter:card'
                          content='summary'/>
                    <meta name='twitter:url' content='https://spotmyvaccine.in/'/>
                    <meta name='twitter:title' content='SpotMyVaccine'/>
                    <meta name='twitter:description'
                          content='SpotMyVaccine is platform for getting real-time updates about vaccines in India.'/>
                    <meta name='twitter:image' content='/images/icon-512x512.png'/>
                    <meta name='twitter:creator' content='@jithinantony333'/>

                    <meta property='og:type' content='website'/>
                    <meta property='og:title' content='SpotMyVaccine'/>
                    <meta property='og:description'
                          content='SpotMyVaccine is platform for getting real-time updates about vaccines in India.'/>
                    <meta property='og:site_name' content='SpotMyVaccine'/>
                    <meta property='og:url' content='https://spotmyvaccine.in/'/>
                    <meta property='og:image' content='/images/icon-512x512.png'/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async ctx => {

    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
