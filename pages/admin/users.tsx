import {AdminLayout} from "components/admin/Layout";
import {NextPage} from "next";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useCallback, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import {UserTable, UserTableEdit} from "../../src/components/table/preset/user/UsersTable";

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
    mutation UpdateUser($id: String!, $data: UserUpdateInput!) {
        updateOneUser(id: $id, data: $data) {
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

    const handleUpdateUser = useCallback(async (userId: string, values: UserTableEdit): Promise<any> => {
        return updateUser({
            variables: {
                id: userId,
                data: values,
            },
        })
    }, [updateUser])

    useEffect(() => {
        if (error) {
            toast.error('Erreur interne');
            console.error(error);
        }
    }, [error]);

    return (
        <AdminLayout title="Utilisateurs" current="users">
            <div className="py-4">
                <UserTable
                    data={data?.users || []}
                    fetchData={fetchData}
                    loading={loading}
                    error={error}
                    count={data?.userCount || 0}
                    onUpdate={handleUpdateUser}
                />
            </div>
        </AdminLayout>
    )
}

export default UserDashboard
