import { AdminLayout, AdminLayoutHeader } from 'components/layout/Admin';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { Role } from 'constants/role';
import Link from 'next/link';
import {
  GetGroupInfoDocument,
  GetGroupInfoQuery,
  GetGroupInfoQueryVariables,
  GroupFragment,
  useUpdateGroupMutation,
} from 'generated/graphql';
import { useRefetch } from 'hooks';
import { createApolloContext } from 'schema/context';
import { initializeApollo } from 'services/apollo/client';
import { UpdateGroupForm } from 'components/forms/UpdateGroup';
import { UpdateGroupInputs } from 'types';
import { NextSeo } from 'next-seo';

interface PageProps {
  group: GroupFragment;
}

export const GroupDashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ group }) => {
  const refetch = useRefetch();
  const [updateGroup] = useUpdateGroupMutation();

  const handleUpdate = useCallback(
    (data: UpdateGroupInputs) => {
      return updateGroup({
        variables: {
          id: group.id,
          data,
        },
      })
        .then(() => {
          return refetch();
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            'Une erreur est intervenue lors le la mise à jour du groupe'
          );
        });
    },
    [group.id, refetch, updateGroup]
  );

  return (
    <AdminLayout current="groups">
      <NextSeo
        title={`Modification ${group.name} (dashboard) - Groupomania`}
        description={`Modifiez les information du groupe de discussion ${group.name}`}
      />
      <AdminLayoutHeader
        title="Modification du groupe"
        desc="Modifiez les paramètres du groupe."
        actions={
          <Link href={`/admin/groups`}>
            <a className="btn btn-white mr-4">
              Retourner à la liste des groupes
            </a>
          </Link>
        }
      />

      <UpdateGroupForm group={group} onUpdate={handleUpdate} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  PageProps,
  { id: string }
> = async ({ params }) => {
  if (!params || !params.id) {
    return {
      notFound: true,
    };
  }

  const context = await createApolloContext({ superUser: true });
  const apollo = await initializeApollo(null, context);

  const { data } = await apollo.query<
    GetGroupInfoQuery,
    GetGroupInfoQueryVariables
  >({
    query: GetGroupInfoDocument,
    variables: {
      id: params.id,
    },
  });

  if (!data || !data.group) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      group: JSON.parse(JSON.stringify(data.group)),
    },
  };
};

GroupDashboard.auth = {
  roles: [Role.ADMIN],
};

export default GroupDashboard;
