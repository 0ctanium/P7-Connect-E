import {AdminLayout} from "components/layout/Admin";
import {NextPage} from "next";
import {gql, useQuery} from "@apollo/client";
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
import { Disclosure, Switch } from "@headlessui/react";
import {HiChevronUp as ChevronUpIcon, HiX, HiCheck} from 'react-icons/hi'
import clsx from "clsx";
import {SwitchField} from "../../src/components/fields/SwitchField";

export async function getStaticProps() {
    return { props: { htmlClass: 'bg-gray-100', bodyClass: '' } };
}

export const groupsQuery = gql`
    query GetGroupes($skip: Int = 0, $take: Int = 20) {
        groups(skip: $skip, take: $take) {
            id
            name
            description
            confidentiality
            memberCount
            banner
            official
            archived
            
            createdAt
        }
        userCount
    }
`;

export const UserDashboard: NextPage = () => {
    const { data, loading, error, refetch } = useQuery(groupsQuery, { notifyOnNetworkStatusChange: true });
    const [open, setOpen] = useState(false)

    const fetchIdRef = useRef(0);
    const fetchData = useCallback(
        ({ pageIndex, pageSize: offset }) => {
            const fetchId = ++fetchIdRef.current;

            if (fetchId === fetchIdRef.current) {
                refetch({
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


    const [onlyAdminCanPublish, setOnlyAdminCanPublish] = useState(false)
    const [postNeedToBeApproved, setPostNeedToBeApproved] = useState(false)
    const [everyOneCanApproveMembers, setEveryOneCanApproveMembers] = useState(false)

    return (
        <AdminLayout title="Groupes" desc="Ajoutez ou supprimer des groupes" current="groups" actions={
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => setOpen(true)}
            >
                Ajouter un groupe officiel
            </button>
        }>
            <div className="py-4">
                <div className="md:overflow-hidden md:rounded-lg shadow -mx-4 sm:-mx-6 md:mx-0">
                    <GroupTable
                        data={data?.users || []}
                        fetchData={fetchData}
                        loading={loading}
                        error={error}
                        count={data?.userCount || 0}
                        onUpdate={console.log}
                        onDelete={console.log}
                    />
                </div>
            </div>

            <SlideOver open={open} onClose={setOpen} className="max-w-md">
                <SlideOverBody as="form">
                    <SlideOverContainer>
                        <SlideOverTitle
                            onClose={setOpen}
                            title="Nouveau groupe officiel"
                            desc="Veuillez remplir les informations ci-dessous afin de créer un nouveau groupe officiel."
                        />

                        <SlideOverContent>
                            <SlideOverSection>
                                <div className="space-y-6 pt-6 pb-5">
                                    <Field name="name" id="name" label="Nom du groupe" type="text" required fullWidth />
                                    <Field name="description" id="description" label="Description" type="text" minRows={4} hint="Optionnelle" multiline fullWidth />

                                    <RadioGroup legend="Confidentialité">
                                        <Radio
                                            label="Ouvert"
                                            desc="Tout le monde peut voir le groupe, ses membres et leurs messages."
                                            id="privacy-public"
                                            name="privacy" defaultChecked />
                                        <Radio
                                            label="Fermé"
                                            desc="Tout le monde peut trouver le groupe et en voir les membres. Seuls les membres peuvent voir les publications."
                                            id="privacy-closed"
                                            name="privacy" />
                                        <Radio
                                            label="Secret"
                                            desc="Seuls les membres peuvent trouver le groupe, en voir les membres et leurs publications."
                                            id="privacy-secret"
                                            name="privacy" />
                                    </RadioGroup>

                                    <div>

                                        <FormDisclosure label="Paramètres des adhésions">
                                            <SwitchField
                                                label="Tout le monde peut approuver les membres"
                                                desc="."
                                                name={'everyOneCanApproveMembers'}
                                                onChange={setEveryOneCanApproveMembers}
                                                value={everyOneCanApproveMembers}
                                            />
                                        </FormDisclosure>

                                        <FormDisclosure label="Paramètres des posts">
                                            <SwitchField
                                                label="Restreindre les publications"
                                                desc="Seulement les administrateurs peuvent publier des posts."
                                                name={'onlyAdminCanPublish'}
                                                onChange={setOnlyAdminCanPublish}
                                                value={onlyAdminCanPublish}
                                            />
                                            <SwitchField
                                                label="Approuver les publications"
                                                desc="Les publications des membres doivent êtres approuvé par un admin ou un modérateur."
                                                name={'postNeedToBeApproved'}
                                                onChange={setPostNeedToBeApproved}
                                                value={postNeedToBeApproved}
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
