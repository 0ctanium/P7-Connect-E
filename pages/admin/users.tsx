import {AdminLayout} from "components/layout/Admin";
import {NextPage} from "next";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useCallback, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import {UserTable, TableEdit} from "components/table/preset/user/UsersTable";
import {Role} from "constants/role";

export const usersQuery = gql`
    query GetUsers($skip: Int = 0, $take: Int = 20) {
        users(skip: $skip, take: $take) {
            id
            email
            name
            image
            role
            accounts {
                provider
                createdAt
            }
            createdAt
        }
        userCount
    }
`;

export const updateUserMutation = gql`
    mutation UpdateUser($ids: [String!], $data: UserUpdateInput!) {
        deleteManyUser(where: { id: { in: $ids } }, data: $data) {
            id
            email
            name
            image
            role
            createdAt
            updatedAt
        }
    }
`;

export const deleteUserMutation = gql`
    mutation DeleteUser($id: String!) {
        deleteManyUser(where: { id: $id }) {
            id
        }
    }
`;

export const UserDashboard: NextPage = () => {
    const { data, loading, error, refetch } = useQuery(usersQuery, { notifyOnNetworkStatusChange: true });
    const [updateUser] = useMutation(updateUserMutation, {
        onError(err) {
            // check if user off-line
            if(err.networkError && typeof window !== 'undefined' && !window.navigator.onLine) {
                toast.error("Votre navigateur est hors ligne")
            } else {
                let message = ""
                for (const gqlError of err.graphQLErrors) {
                    const path = gqlError.path?.join('.')

                    switch (path) {
                        case "data.role":
                            message += gqlError.message
                            break;
                        case "data.name":
                            message += gqlError.message
                            break;
                    }
                }

                if(!message) {
                    message = "Une erreur est arrivée"
                }

                toast.error(message)
            }
        }
    });

    const [deleteUser] = useMutation(deleteUserMutation, {
        onError(err) {
            // check if user off-line
            if(err.networkError && typeof window !== 'undefined' && !window.navigator.onLine) {
                toast.error("Votre navigateur est hors ligne")
            } else {
                toast.error("Une erreur est arrivée")
            }
        },
        onCompleted() {
            refetch()
        }
    });

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

    const handleUpdateUser = useCallback(async (userId: string, values: TableEdit): Promise<any> => {
        return updateUser({
            variables: {
                id: userId,
                data: values,
            },
        })
    }, [updateUser])

    const handleDeleteUsers = useCallback(async (userIds: string[]): Promise<any> => {
        console.log("deleting users: ", userIds)
        return
        // return deleteUser({
        //     variables: {
        //         id: userId,
        //     },
        // })
    }, [])

    useEffect(() => {
        if (error) {
            toast.error('Erreur interne');
            console.error(error);
        }
    }, [error]);

    return (
        <AdminLayout title="Utilisateurs" current="users">
            <div className="py-4">
                <div className="md:overflow-hidden md:rounded-lg shadow -mx-4 sm:-mx-6 md:mx-0">
                    <UserTable
                        data={data?.users || []}
                        fetchData={fetchData}
                        loading={loading}
                        error={error}
                        count={data?.userCount || 0}
                        onUpdate={handleUpdateUser}
                        onDelete={handleDeleteUsers}
                    />
                </div>
            </div>
        </AdminLayout>
    )
}

UserDashboard.auth = {
    roles: [Role.ADMIN],
}

export default UserDashboard
