import type { AppProps } from 'next/app'
import {useApollo} from "hooks";
import {ApolloProvider} from "@apollo/client";
import {SessionProvider, useSession} from 'next-auth/react'
import {toast, ToastContainer} from "react-toastify";
import {useRouter} from "next/router";
import {UnauthorizedErrorPage} from "components/layout/errors";
import {FC, useEffect, useMemo} from "react";
import {AuthWallConfig} from "types";
import moment from "moment";


import 'styles/globals.css'
import 'moment/locale/fr';
import 'react-toastify/dist/ReactToastify.css';
import {defaultBodyClass, defaultHtmlClass} from "../src/constants";
moment.locale('fr')

export default function App({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState)

    useEffect(() => {
        document.documentElement.className = pageProps?.htmlClass || defaultHtmlClass;
        document.body.className = pageProps?.bodyClass || defaultBodyClass;
    });

    return (
        <SessionProvider session={pageProps.session}>
            <ApolloProvider client={apolloClient}>
                {Component.auth ? <AuthWall config={Component.auth}><Component {...pageProps} /></AuthWall> : <Component {...pageProps} />}
            <ToastContainer />
            </ApolloProvider>
        </SessionProvider>
    )
}

const AuthWall: FC<{ config: AuthWallConfig }> = ({ children, config }) => {
    const router = useRouter()
    const { data: session, status } = useSession({ required: true })
    const isAuthenticated = !!session?.user
    const isAuthorized = useMemo(() => {
        return !(config.roles && !config.roles.includes(session?.user.role));
    }, [config, session?.user.role])

    useEffect(() => {
        if(isAuthenticated) {
            if(!isAuthorized) {
                console.log('log')
                toast.error("Vous n'êtes pas autorisé à accéder cette page")
                if(config.unauthorized) {
                    router.push(config.unauthorized)
                }
            }
        }
    }, [config.unauthorized, isAuthenticated, isAuthorized, router])

    if (isAuthenticated) {
        if(!isAuthorized) {
            return config.unauthorizedLayout || <UnauthorizedErrorPage />
        }
        return <>{children}</>
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>
}
