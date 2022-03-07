import {AdminLayout} from "components/admin/Layout";
import {NextPage} from "next";
import {gql, useQuery} from "@apollo/client";
import {useCallback, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import {UserTable} from "../../src/components/table/UsersTable";

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

export const UserDashboard: NextPage = () => {
    const { data, loading, error, refetch } = useQuery(usersQuery, { notifyOnNetworkStatusChange: true });
    const fetchIdRef = useRef(0);

    const fetchData = useCallback(
        ({ pageIndex, pageSize: offset }) => {
            const fetchId = ++fetchIdRef.current;

            console.log(fetchId, pageIndex, offset)

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

    return (
        <AdminLayout title="Utilisateurs" current="users">
            <div className="py-4">
                <UserTable
                    data={data?.users || []}
                    fetchData={fetchData}
                    loading={loading}
                    error={error}
                    count={data?.userCount || 0}
                />
            </div>
        </AdminLayout>
    )
}

export default UserDashboard
