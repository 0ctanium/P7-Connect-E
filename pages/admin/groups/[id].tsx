import {AdminLayout, AdminLayoutHeader, AdminLayoutSection} from "components/layout/Admin";
import {GetServerSideProps, NextPage} from "next";
import {gql, useMutation, useQuery} from "@apollo/client";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import {Radio, RadioGroup } from "components/fields/Radio";
import {Field} from "components/fields/Field";
import {SwitchField} from "components/fields/SwitchField";
import {Controller, SubmitHandler, useForm, useWatch} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useRouter} from "next/router";
import Link from "next/link";
import {NexusGenFieldTypes} from "../../../generated/nexus-typegen";
import {useDropzone} from "react-dropzone";
import clsx from "clsx";
import { isPromise } from "lib/utils";
import {Spinner} from "../../../src/icons/Spinner";

export const getServerSideProps: GetServerSideProps = async () => {
    return { props: { htmlClass: 'bg-gray-100', bodyClass: '' } };
}

export const groupQuery = gql`
    query GetGroup($id: String!) {
        group(where: { id: $id }) {
            id
            name
            description
            privacy
            memberCount
            banner
            official
            archived
            
            createdAt
        }
    }
`;

export const updateGroupMutation = gql`
    mutation CreateGroup($data: GroupUpdateInput!, $where: GroupWhereUniqueInput!) {
        updateOneGroup(data: $data, where: $where) {
            id
        }
    }
`;

interface Inputs {
    name?: string | null;
    description?: string | null;
    privacy?: 'OPEN' | 'CLOSED' | 'SECRET' | null;
    official?: boolean | null;
    everyOneCanApproveMembers?: boolean | null;
    postNeedToBeApproved?: boolean | null;
    onlyAdminCanPublish?: boolean | null;
    banner?: (File & { preview: string }) | null;
}

const schema = yup.object<Inputs>({
    name: yup.string().nullable(),
    description: yup.string().nullable(),
    official: yup.boolean().nullable(),
    privacy: yup.string().oneOf(['OPEN', 'CLOSED', 'SECRET']).nullable(),
    everyOneCanApproveMembers: yup.boolean().nullable(),
    postNeedToBeApproved: yup.boolean().nullable(),
    onlyAdminCanPublish: yup.boolean().nullable(),

    banner: yup.mixed<Inputs["banner"]>().nullable()
}).required();


export const UserDashboard: NextPage = () => {
    const { id } = useRouter().query
    const [updateGroup] = useMutation(updateGroupMutation)
    const { data, loading, error, refetch } = useQuery(groupQuery, { notifyOnNetworkStatusChange: true, variables: {
            id
        }});

    useEffect(() => {
        if (error) {
            toast.error('Erreur interne');
            console.error(error);
        }
    }, [error]);

    const handleUpdate = useCallback((data: Inputs) => {
        console.log(data)
        return updateGroup({
            variables: { data }
        }).catch((err) => {
            console.error(err)
            toast.error("Une erreur est intervenue lors le la mise à jour du groupe")
        }).then(() => {
            return refetch()
        })
    }, [refetch, updateGroup])

    return (
        <AdminLayout current="groups" loading={loading}>
            <AdminLayoutHeader title="Edition du groupe" desc="Visualisez et modifiez les paramètres d'un groupe." actions={
                <Link href="/admin/groups">
                    <a className="btn btn-white">Retour</a>
                </Link>
            }/>

            {data?.group && <Form group={data.group} onUpdate={handleUpdate} />}


        </AdminLayout>
    )
}

const Form: FC<{ group: NonNullable<NexusGenFieldTypes["Group"]>, onUpdate(d: Inputs): any | Promise<any> }> = ({ group, onUpdate }) => {
    const defaultValues = {
        ...group,
        banner: null
    }

    const { register, handleSubmit, control, reset, formState, setValue,  } = useForm<Inputs>({
        defaultValues,
        resolver: yupResolver(schema)
    });
    const banner = useWatch({
        control,
        name: 'banner'
    })
    const { errors } = formState

    const [loading, setLoading] = useState(false)

    const dirtyFields = useRef<Inputs>(null);
    useEffect(() => {
        // @ts-ignore
        dirtyFields.current = formState.dirtyFields;
    });

    const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
        if(!dirtyFields?.current) {
            toast.warn("Impossible de lire les modifications apportés")
            return
        }

        const values = Object.entries(data).reduce((acc, [key, val]) => {
            // @ts-ignore
            if(dirtyFields.current[key] === true) {
                // @ts-ignore
                acc[key] = val
            }

            return acc
        }, {})
        // @ts-ignore
        if(banner) values['banner'] = banner

        if(!Object.keys(values).length) {
            toast.warn("Aucune modification n'a été apporté")
            return
        }

        const res =  onUpdate(values) as Promise<void>
        if(isPromise(res)) {
            // Set loading state
            setLoading(true)

            res.finally(() => {
                // Remove loading state
                setLoading(false)
            })
        }
    }, [banner, onUpdate])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        multiple: false,
        maxSize: 10000000, // 10 MB
        onDropAccepted: ([file]) => {
            setValue('banner', Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
        },
        onDropRejected: (rejection) => {
            rejection[0].errors.forEach((err) => {
                switch (err.code) {
                    case "file-invalid-type":
                        toast.error("Le format du fichier n'est pas accepté")
                        break;
                    case "file-too-large":
                        toast.error("Le fichier est trop volumineux")
                        break;
                    case "file-too-small":
                        toast.error("Le fichier est trop peu volumineux")
                        break;
                    case "too-many-files":
                        toast.error("Trop de fichiers ont étés téléchargés")
                        break;
                    default:
                        toast.error("Impossible de télécharger l'image")
                        break;
                }

            })
        }
    })

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        if(banner) URL.revokeObjectURL(banner.preview);
    }, [banner]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Section title="Configuration" desc="Ces informations sont disponibles publiquement. Soyez vigilant aux informations que vous entrez.">
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                            <Field {...register('name')}
                                   label="Nom du groupe"
                                   type="text"
                                   id="name"
                                   fullWidth/>
                        </div>
                    </div>

                    <Field {...register('description')}
                           label="Description"
                           type="text"
                           id="description"
                           minRows={3}
                           desc="Donnez une breve description de votre groupe"
                           fullWidth
                           multiline
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo de couverture</label>
                        <div {...getRootProps()} className={clsx(
                            'relative overflow-hidden mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md object-contain min-h-[140px]',
                            (isDragActive) ? 'border-indigo-600' : 'border-gray-300' )}
                             style={{ background: banner?.preview ? `url(${banner.preview})` : undefined }}>
                            {/*{banner && <img src={banner.preview} alt="Preview" className="absolute w-full h-full inset-0" />}*/}
                            <div className={clsx('space-y-1 text-center', banner && 'sr-only')}>
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="banner"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Télécharger un fichier</span>
                                        <input id="banner" className="sr-only" {...getInputProps()} />
                                    </label>
                                    <p className="pl-1">ou glisser-déposer</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu{"'"}à 10Mo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Configuration" desc="Paramétrez le fonctionnement du groupe.">
                <div className="space-y-6">
                    <RadioGroup legend="Confidentialité">
                        <Radio
                            label="Ouvert"
                            desc="Tout le monde peut voir le groupe, ses membres et leurs messages."
                            id="privacy-public"
                            value="OPEN"
                            {...register('privacy')} />
                        <Radio
                            label="Fermé"
                            desc="Tout le monde peut trouver le groupe et en voir les membres. Seuls les membres peuvent voir les publications."
                            id="privacy-closed"
                            value="CLOSED"
                            {...register('privacy')}  />
                        <Radio
                            label="Secret"
                            desc="Seuls les membres peuvent trouver le groupe, en voir les membres et leurs publications."
                            id="privacy-secret"
                            value="SECRET"
                            {...register('privacy')}  />
                        {errors.privacy?.message && (
                            <p
                                id={`privacy-error`}
                                className="mt-2 text-sm text-red-600">
                                {errors.privacy?.message}
                            </p>
                        )}
                    </RadioGroup>

                    <RadioGroup legend="Qui peut approuver les adhésions ?">
                        <Radio
                            label="Tout le monde"
                            desc="Les membres peuvent approuver seulement approuver les demandes de leurs collègues."
                            id="everyOneCanApproveMembers-true"
                            value="true"
                            {...register('everyOneCanApproveMembers')} />
                        <Radio
                            label="Administrateurs et modérateurs uniquement"
                            id="everyOneCanApproveMembers-false"
                            value="false"
                            {...register('everyOneCanApproveMembers')}  />
                        {errors.everyOneCanApproveMembers?.message && (
                            <p
                                id={`everyOneCanApproveMembers-error`}
                                className="mt-2 text-sm text-red-600">
                                {errors.everyOneCanApproveMembers?.message}
                            </p>
                        )}
                    </RadioGroup>

                    <Controller
                        name="onlyAdminCanPublish"
                        control={control}
                        render={({ field}) => (
                            <SwitchField
                                label="Restreindre les publications"
                                desc="Seulement les administrateurs peuvent publier des posts."
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="postNeedToBeApproved"
                        control={control}
                        render={({ field}) => (
                            <SwitchField
                                label="Approuver les publications"
                                desc="Les publications des membres doivent êtres approuvé par un admin ou un modérateur."
                                {...field}
                            />
                        )}
                    />
                </div>
            </Section>

            <AdminLayoutSection>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => reset(defaultValues)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Réinitialiser
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sauvegarder
                        {loading &&  <Spinner className="w-6 h-6 mx-auto text-gray-800 animate-spin" />}
                    </button>
                </div>
            </AdminLayoutSection>
        </form>
    )

}

const Section: FC<{ title?: string, desc?: string }> = ({ children, title, desc }) => {
    return (
        <AdminLayoutSection>
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{desc}</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        {children}
                    </div>
                </div>
            </div>
        </AdminLayoutSection>
    )
}



UserDashboard.auth = {
    roles: [Role.ADMIN],
}

export default UserDashboard
