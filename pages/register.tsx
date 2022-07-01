import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import {
  ClientSafeProvider,
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
import { SignUpForm, useSignUpForm } from '../src/components/forms/SignUp';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { UserCreateInput } from '../src/types';
import { useRegisterMutation } from 'generated/graphql';
import { NextSeo } from 'next-seo';

type Providers = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

interface PageProps {
  providers: Providers | null;
}

const RegisterPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  const [callbackUrl] = useQueryParam('callbackUrl', '/');
  const [error, setError] = useQueryParam('error');
  const providersMap = useMemo(
    () =>
      providers
        ? Object.values(providers).filter((p) => p.type === 'oauth')
        : [],
    [providers]
  );
  const registerForm = useSignUpForm();
  const [register, { data }] = useRegisterMutation();
  const [registerLoading, setLoginLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      toast.warn('Vous êtes déjà connecté');
      router.push(callbackUrl || '/');
    }
  }, [callbackUrl, router, status]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError('');
    }
  }, [error, setError]);

  const handleLogin: SubmitHandler<UserCreateInput> = useCallback(
    (input) => {
      setLoginLoading(true);

      register({
        variables: { input },
      })
        .then(() =>
          signIn('credentials', {
            email: input.email,
            password: input.password,
            redirect: true,
            callbackUrl,
          })
        )
        .catch((err) => {
          console.error(err);
          toast.error('Erreur interne');
        })
        .finally(() => {
          setLoginLoading(false);
        });
    },
    [callbackUrl, register]
  );

  return (
    <>
      <NextSeo
        title="Inscription - Groupomania"
        description="Créez votre compte"
      />
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mx-auto h-12 w-auto"
            src="/icons/icon-left-font.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un nouveau compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href={`/login${window.location.search}`}>
              <a className="font-medium text-scarlet-600 hover:text-scarlet-500">
                connectez vous
              </a>
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!!providersMap.length && (
              <div className="flex flex-col gap-3">
                {providersMap.map((provider) => (
                  <button
                    key={provider.id}
                    className="btn btn-white justify-center"
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl,
                        redirect: true,
                      })
                    }>
                    <SocialIcon
                      className="w-6 h-6 mr-2"
                      provider={provider.id}
                    />
                    Connexion avec {provider.name}
                  </button>
                ))}
              </div>
            )}
            <div className={!!providersMap.length ? 'mt-6' : ''}>
              {!!providersMap.length && (
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou</span>
                  </div>
                </div>
              )}

              <SignUpForm
                form={registerForm}
                loading={registerLoading}
                onSubmit={handleLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  };
};

export default RegisterPage;
