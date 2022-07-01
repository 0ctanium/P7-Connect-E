import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import { Layout } from 'components/layout';
import {
  GetAllGroupsDocument,
  GetAllGroupsQuery,
  GetAllGroupsQueryVariables,
  GroupFragment,
} from 'generated/graphql';
import { createApolloContext } from '../src/schema/context';
import { initializeApollo } from '../src/services/apollo/client';
import { FC, useMemo } from 'react';
import { stringToColour } from '../src/lib/utils';
import Link from 'next/link';

const Groups: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  groups,
}) => {
  return (
    <Layout current="groups" title="Groupes" showTitle>
      <div className="container mx-auto pt-16 lg:max-w-md xl:max-w-screen-md 2xl:max-w-screen-lg">
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ul>
      </div>
    </Layout>
  );
};

const GroupCard: FC<{ group: GroupFragment }> = ({ group }) => {
  const backgroundColor = useMemo(() => stringToColour(group.id), [group.id]);

  return (
    <li className="col-span-1 flex flex-col group text-left bg-white sm:rounded-lg overflow-hidden shadow">
      <Link href={`/groups/${group.id}`}>
        <a>
          <div
            className="group-hover:opacity-80 relative block w-full h-48"
            style={{ backgroundColor }}>
            {group.banner && (
              <Image
                priority
                src={group.banner}
                layout="fill"
                objectFit="cover"
                alt={`Bannière du groupe ${group.name}`}
              />
            )}
          </div>
          <div className="px-4 py-1 group-hover:underline">
            <p className="text-lg font-medium leading-1">{group.name}</p>
            <p className="text-sm font-light">
              {group.description || 'Aucune description'}
            </p>
          </div>
        </a>
      </Link>
    </li>
  );
};

export const getStaticProps: GetStaticProps<GetAllGroupsQuery> = async () => {
  const context = await createApolloContext({ superUser: true });
  const apollo = await initializeApollo(null, context);

  const res = await apollo.query<GetAllGroupsQuery, GetAllGroupsQueryVariables>(
    {
      query: GetAllGroupsDocument,
    }
  );

  return {
    props: {
      groups: JSON.parse(JSON.stringify(res.data.groups || [])),
    },
    revalidate: 1, // minute
  };
};

Groups.auth = {};

export default Groups;
