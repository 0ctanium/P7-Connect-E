import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutSection,
} from 'components/layout/Admin';
import { NextPage } from 'next';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { UserTable, TableEdit } from 'components/table/preset/user/UsersTable';
import { Role } from 'constants/role';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from 'generated/graphql';
import { NextSeo } from 'next-seo';

export const UserDashboard: NextPage = () => {
  const { data, loading, error, refetch } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation({
    onError(err) {
      // check if user off-line
      if (
        err.networkError &&
        typeof window !== 'undefined' &&
        !window.navigator.onLine
      ) {
        toast.error('Votre navigateur est hors ligne');
      } else {
        let message = '';
        for (const gqlError of err.graphQLErrors) {
          const path = gqlError.path?.join('.');

          switch (path) {
            case 'data.role':
              message += gqlError.message;
              break;
            case 'data.name':
              message += gqlError.message;
              break;
          }
        }

        if (!message) {
          message = 'Une erreur est arrivée';
        }

        toast.error(message);
      }
    },
  });

  const [deleteUser] = useDeleteUserMutation({
    onError(err) {
      // check if user off-line
      if (
        err.networkError &&
        typeof window !== 'undefined' &&
        !window.navigator.onLine
      ) {
        toast.error('Votre navigateur est hors ligne');
      } else {
        toast.error('Une erreur est arrivée');
      }
    },
    onCompleted() {
      refetch();
    },
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

  const handleUpdateUser = useCallback(
    async (userId: string, values: TableEdit): Promise<any> => {
      return updateUser({
        variables: {
          id: userId,
          data: values,
        },
      });
    },
    [updateUser]
  );

  const handleDeleteUsers = useCallback(
    async (userIds: string[]): Promise<any> => {
      console.log('deleting users: ', userIds);
      return;
      // return deleteUser({
      //     variables: {
      //         id: userId,
      //     },
      // })
    },
    []
  );

  useEffect(() => {
    if (error) {
      toast.error('Erreur interne');
      console.error(error);
    }
  }, [error]);

  return (
    <AdminLayout current="users">
      <NextSeo
        title={`Utilisateurs (dashboard) - Groupomania`}
        description="Gerez les utilisateurs Groupomania"
      />
      <AdminLayoutHeader title="Utilisateurs" />
      <AdminLayoutSection>
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
      </AdminLayoutSection>
    </AdminLayout>
  );
};

UserDashboard.auth = {
  roles: [Role.ADMIN],
};

export default UserDashboard;
