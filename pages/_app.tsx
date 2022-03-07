import type { AppProps } from 'next/app'
import {useApollo} from "hooks";
import {ApolloProvider} from "@apollo/client";
import { SessionProvider } from 'next-auth/react'

import 'styles/globals.css'
import 'moment/locale/fr';
import moment from "moment";

moment.locale('fr')

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <SessionProvider session={pageProps.session}>
        <ApolloProvider client={apolloClient}>
          {/*<Head>*/}
          {/*  <title>Create Next App</title>*/}
          {/*  <meta name="description" content="Generated by create next app" />*/}
          {/*  <link rel="icon" href="/favicon.ico" />*/}
          {/*</Head>*/}
          <Component {...pageProps} />
        </ApolloProvider>
    </SessionProvider>
  )
}

export default MyApp
