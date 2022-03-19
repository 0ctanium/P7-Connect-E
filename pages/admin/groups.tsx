import {AdminLayout, AdminLayoutHeader, AdminLayoutSection} from "components/layout/Admin";
import {NextPage} from "next";
import {gql, useMutation, useQuery} from "@apollo/client";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import {GroupTable} from "../../src/components/table/preset/groups/GroupsTable";
import {
    SlideOver,
    SlideOverBody,
    SlideOverContainer,
    SlideOverContent,
    SlideOverFooter, SlideOverSection,
    SlideOverTitle
} from "components/SlideOver";
import {Radio, RadioGroup } from "components/fields/Radio";
import {Field} from "../../src/components/fields/Field";
import { Disclosure } from "@headlessui/react";
import {HiChevronUp as ChevronUpIcon} from 'react-icons/hi'
import {SwitchField} from "../../src/components/fields/SwitchField";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export async function getStaticProps() {
    return { props: { htmlClass: 'bg-gray-100', bodyClass: '' } };
}

export const groupsQuery = gql`
    query GetGroups($skip: Int = 0, $take: Int = 20) {
        groups(skip: $skip, take: $take) {
            id
            name
            description
            privacy
            memberCount
            banner
            official
            archived
            
            everyOneCanApproveMembers
            
            
            createdAt
        }
        groupCount
    }
`;

export const createGroupMutation = gql`
    mutation CreateGroup($data: GroupCreateInput!) {
        createOneGroup(data: $data) {
            id
        }
    }
`;

interface Inputs {
    name: string;
    description?: string
    privacy: 'OPEN' | 'CLOSED' | 'SECRET'
    everyOneCanApproveMembers: boolean
    postNeedToBeApproved: boolean
    onlyAdminCanPublish: boolean
}

const schema = yup.object<Inputs>({
    name: yup.string().required(),
    description: yup.string(),
    privacy: yup.string().oneOf(['OPEN', 'CLOSED', 'SECRET']).required(),
    everyOneCanApproveMembers: yup.boolean(),
    postNeedToBeApproved: yup.boolean(),
    onlyAdminCanPublish: yup.boolean()
}).required();

export const UserDashboard: NextPage = () => {
    const { data, loading, error, refetch } = useQuery(groupsQuery, { notifyOnNetworkStatusChange: true });
    const [createGroup] = useMutation(createGroupMutation)
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            privacy: 'OPEN',
            everyOneCanApproveMembers: true,
            onlyAdminCanPublish: false,
            postNeedToBeApproved: false,
        },
        resolver: yupResolver(schema)
    });
    const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
        createGroup({
            variables: {
                data: {
                    ...data,
                    official: true
                }
            }
        }).then(() => {
            toast.success('Groupe créé avec succès')
            reset()
            setOpen(false)
            return refetch()
        }).catch((err) => {
            console.error(err)
            toast.error('Une erreur est survenue')
        })
    }, [createGroup, refetch, reset])

    const fetchIdRef = useRef(0);
    const fetchData = useCallback(
        ({ pageIndex, pageSize: offset }) => {
            const fetchId = ++fetchIdRef.current;

            if (fetchId === fetchIdRef.current) {
                return refetch({
                    skip: pageIndex * offset,
                    take: offset,
                });
            }
        },
        [refetch]
    );

    useEffect(() => {
        if (error) {
            toast.error('Erreur interne');
            console.error(error);
        }
    }, [error]);

    return (
        <AdminLayout current="groups">
            <AdminLayoutHeader  title="Groupes" desc="Ajoutez ou supprimer des groupes" actions={
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setOpen(true)}
                >
                    Ajouter un groupe officiel
                </button>
            }/>

            <AdminLayoutSection>
                <div className="py-4">
                    <div className="md:overflow-hidden md:rounded-lg shadow -mx-4 sm:-mx-6 md:mx-0">
                        <GroupTable
                            data={data?.groups || []}
                            fetchData={fetchData}
                            loading={loading}
                            error={error}
                            count={data?.groupCount || 0}
                            onDelete={console.log}
                        />
                    </div>
                </div>
            </AdminLayoutSection>

            <SlideOver open={open} onClose={setOpen} className="max-w-md">
                {/* @ts-ignore */}
                <SlideOverBody<HTMLFormElement> as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <SlideOverContainer>
                        <SlideOverTitle
                            onClose={setOpen}
                            title="Nouveau groupe officiel"
                            desc="Veuillez remplir les informations ci-dessous afin de créer un nouveau groupe officiel."
                        />

                        <SlideOverContent>
                            <SlideOverSection>
                                <div className="space-y-6 pt-6 pb-5">
                                    <Field {...register('name')} error={errors.name?.message} id="name" label="Nom du groupe" type="text" required fullWidth />
                                    <Field {...register('description')} error={errors.description?.message}  id="description" label="Description" type="text" minRows={4} hint="Optionnelle" multiline fullWidth />

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

                                    <div>

                                        <FormDisclosure label="Paramètres des adhésions">
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
                                        </FormDisclosure>

                                        <FormDisclosure label="Paramètres des posts">
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
                                        </FormDisclosure>
                                    </div>
                                </div>

                            </SlideOverSection>
                        </SlideOverContent>
                    </SlideOverContainer>
                    <SlideOverFooter>
                        <button
                            type="button"
                            className="btn btn-white"
                            onClick={() => setOpen(false)}
                        >
                            Anuler
                        </button>
                        <button
                            type="submit"
                            className="ml-4 btn btn-primary"
                        >
                            Créer
                        </button>
                    </SlideOverFooter>
                </SlideOverBody>
            </SlideOver>
        </AdminLayout>
    )
}

const FormDisclosure: FC<{label: string}> = ({ label, children }) => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="group flex py-2 text-sm font-medium text-left text-indigo-600 hover:text-indigo-500">
                        <ChevronUpIcon
                            className={`${
                                open ? 'transform rotate-180' : ''
                            } w-5 h-5 text-indigo-600 group-hover:text-indigo-500`}
                        />
                        <span>{label}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-6 px-4 pt-3 pb-2 text-sm text-gray-500">
                        {children}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

UserDashboard.auth = {
    roles: [Role.ADMIN],
}

export default UserDashboard
