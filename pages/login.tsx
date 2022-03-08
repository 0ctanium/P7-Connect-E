import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from "next";
import {ClientSafeProvider, getProviders, LiteralUnion, signIn, useSession} from "next-auth/react";
import {useEffect, useMemo} from "react";
import {BuiltInProviderType} from "next-auth/providers";
import {SocialIcon} from "../src/icons/Social";
import {AccountProvider} from "../src/constants/provider";
import {useQueryParam} from "../src/hooks";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null

const LoginPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ providers }) => {
    const [callbackUrl] = useQueryParam('callbackUrl', '/')
    const [error] = useQueryParam('error')
    const providersMap = useMemo(() => providers ? Object.values(providers) : [], [providers])

    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        if(status === "authenticated") {
            toast.warn("Vous êtes déjà connecté")
            router.push('/')
        }
    }, [router, status])

    useEffect(() => {
        toast.error(error)
    }, [error])

    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/icons/icon-left-font.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Connexion à votre compte</h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="flex flex-col gap-3">
                            {providersMap.map((provider) => (
                                <button
                                    key={provider.id}
                                    className="btn btn-white justify-center"
                                    onClick={() => signIn(provider.id, {
                                        callbackUrl,
                                        redirect: true
                                    })}
                                >
                                    <SocialIcon className="w-6 h-6 mr-2" provider={provider.id as AccountProvider} />Connexion avec {provider.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<{ providers: Providers }> = async () => {
    const providers = await getProviders()
    return {
        props: { providers },
    }
}

export default LoginPage
