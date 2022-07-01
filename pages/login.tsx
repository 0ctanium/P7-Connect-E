import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BuiltInProviderType } from 'next-auth/providers';
import { SocialIcon } from 'icons/Social';
import { useQueryParam } from 'hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { SignInForm, useSignInForm } from '../src/components/forms/SignIn';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { SignInInputs } from '../src/types';
import { NextSeo } from 'next-seo';
import { SignInErrorTypes } from 'next-auth/core/pages/signin';

type Providers = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

interface PageProps {
  providers: Providers | null;
  csrfToken?: string;
}

const LoginPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, csrfToken }) => {
  const [callbackUrl] = useQueryParam('callbackUrl', '/');
  const [error, setError] = useQueryParam<SignInErrorTypes | ''>('error');
  const providersMap = useMemo(
    () =>
      providers
        ? Object.values(providers).filter((p) => p.id !== 'credentials')
        : [],
    [providers]
  );
  const loginForm = useSignInForm();
  const [loginLoading, setLoginLoading] = useState(false);

  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl || '/');
    }
  }, [callbackUrl, router, status]);

  useEffect(() => {
    if (error) {
      setError('');
      switch (error) {
        case 'Signin':
          toast.error('Connexion refusée');
          break;
        case 'OAuthSignin':
          toast.error('Connexion refusée par le fournisseur');
          break;
        case 'OAuthCallback':
          toast.error('Erreur lors de la liason avec le fournisseur');
          break;
        case 'OAuthCreateAccount':
          toast.error('Erreur lors de la creation du compte fournisseur');
          break;
        case 'EmailCreateAccount':
          toast.error("Erreur lors de la creation de l'email");
          break;
        case 'Callback':
          toast.error('Connexion annulée');
          break;
        case 'OAuthAccountNotLinked':
          toast.error(
            'Cettre addresse email est déjà lié à un autre fournisseur'
          );
          break;
        case 'EmailSignin':
          toast.error('Email incorrect');
          break;
        case 'CredentialsSignin':
          toast.error('Mot de passe incorrect');
          break;
        case 'SessionRequired':
          toast.error('Vous devez être connecté.');
          break;
        case 'default':
          toast.error('Erreur interne');
          break;
      }
    }
  }, [error, setError]);

  const handleLogin: SubmitHandler<SignInInputs> = useCallback(
    async ({ email, password }) => {
      setLoginLoading(true);

      const res = await signIn<'credentials'>('credentials', {
        email,
        password,
        redirect: false,
      });
      setLoginLoading(false);

      if (res?.error) {
        toast.error(res.error);
      } else {
        return router.push(callbackUrl || '/');
      }
    },
    [callbackUrl, router]
  );

  return (
    <>
      <NextSeo
        title="Connexion - Groupomania"
        description="Connectez vous à votre compte groupomania"
      />
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mx-auto h-12 w-auto"
            src="/icons/icon-left-font.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href={`/register${window.location.search}`}>
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                inscrivez-vous
              </a>
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col gap-3">
              {providersMap.map((provider) => (
                <button
                  key={provider.id}
                  className="btn btn-white justify-center"
                  onClick={() =>
                    signIn(provider.id, { callbackUrl, redirect: true })
                  }>
                  <SocialIcon className="w-6 h-6 mr-2" provider={provider.id} />
                  Connexion avec {provider.name}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>

              <SignInForm
                form={loginForm}
                loading={loginLoading}
                onSubmit={handleLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const providers = await getProviders();
  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
      providers,
    },
  };
};

export default LoginPage;
