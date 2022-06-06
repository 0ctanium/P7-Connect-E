import {Html, Head, Main, NextScript, DocumentProps} from 'next/document'
import {defaultBodyClass, defaultHtmlClass} from "constants/style";

export default function Document(props: DocumentProps) {
    const pageProps = props?.__NEXT_DATA__?.props?.pageProps;

    return (
        <Html lang="fr" className={pageProps?.htmlClass || defaultHtmlClass}>
            <Head />
            <body className={pageProps?.bodyClass || defaultBodyClass}>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
