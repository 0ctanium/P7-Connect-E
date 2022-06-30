import type { AppProps } from 'next/app';
import { useApollo } from 'hooks';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider, useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { UnauthorizedErrorPage } from 'components/layout/errors';
import { FC, useEffect, useMemo } from 'react';
import { AuthWallConfig } from 'types';
import moment from 'moment';
import { defaultBodyClass, defaultHtmlClass } from 'constants/style';
import { fr } from 'yup-locales';
import * as yup from 'yup';
import Router from 'next/router';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';
import 'styles/globals.css';
import 'moment/locale/fr';
import 'react-toastify/dist/ReactToastify.css';

yup.setLocale(fr);
moment.locale('fr');

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    document.documentElement.className =
      pageProps?.htmlClass !== undefined
        ? pageProps.htmlClass
        : defaultHtmlClass;
    document.body.className =
      pageProps?.bodyClass !== undefined
        ? pageProps.bodyClass
        : defaultBodyClass;
  });

  return (
    <SessionProvider session={pageProps.session}>
      {apolloClient && (
        <>
          <ApolloProvider client={apolloClient}>
            {Component.auth ? (
              <AuthWall config={Component.auth}>
                <Component {...pageProps} />
              </AuthWall>
            ) : (
              <Component {...pageProps} />
            )}
            <ToastContainer />
          </ApolloProvider>
        </>
      )}
    </SessionProvider>
  );
}

const AuthWall: FC<{ config: AuthWallConfig }> = ({ children, config }) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const isAuthenticated = !!session?.user;
  const isAuthorized = useMemo(() => {
    return !(config.roles && !config.roles.includes(session?.user.role));
  }, [config, session?.user.role]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!isAuthorized) {
        toast.error("Vous n'êtes pas autorisé à accéder cette page");
        if (config.unauthorized) {
          router.push(config.unauthorized);
        }
      }
    }
  }, [config.unauthorized, isAuthenticated, isAuthorized, router]);

  if (status === 'loading' && config.loadingLayout) {
    return <>{config.loadingLayout}</>;
  }

  if (isAuthenticated) {
    if (!isAuthorized) {
      return <>{config.unauthorizedLayout}</> || <UnauthorizedErrorPage />;
    }
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <>{children}</>;
};
