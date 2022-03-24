import {AdminLayout, AdminLayoutHeader, AdminLayoutSection} from "components/layout/Admin";
import {NextPage} from "next";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useCallback, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import {GroupTable} from "../../src/components/table/preset/groups/GroupsTable";
import {SubmitHandler, useForm} from "react-hook-form";
import {defaultFormProps, NewGroupInputs, NewGroupSlideOver} from "components/forms/NewGroup";

export async function getStaticProps() {
    return { props: { htmlClass: 'bg-gray-100', bodyClass: '' } };
}

export const groupsQuery = gql`
    query GetGroups {
        groups {
            id
            name
            description
            banner
            
            restricted
            
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

export const UserDashboard: NextPage = () => {
    const { data, loading, error, refetch } = useQuery(groupsQuery, { notifyOnNetworkStatusChange: true });
    const [createGroup] = useMutation(createGroupMutation)
    const form = useForm<NewGroupInputs>(defaultFormProps);
    const { reset } = form

    const [open, setOpen] = useState(false)
    const handleSubmit: SubmitHandler<NewGroupInputs> = useCallback((data) => {
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
                    Ajouter un groupe
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

            <NewGroupSlideOver open={open} onClose={setOpen} onSubmit={handleSubmit} form={form} />
        </AdminLayout>
    )
}

UserDashboard.auth = {
    roles: [Role.ADMIN],
}

export default UserDashboard
