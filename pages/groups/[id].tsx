import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import { Layout } from 'components/layout';
import { prisma } from 'services/prisma';
import { cache, initializeApollo } from 'services/apollo/client';
import { createApolloContext } from 'schema/context';
import Image from 'next/image';
import {
  Post as PostType,
  GetGroupInfoDocument,
  GetGroupInfoQuery,
  GetGroupInfoQueryVariables,
  useGetGroupPostsQuery,
  useCreatePostMutation,
  GetGroupPostsDocument,
  GetGroupPostsQueryVariables,
  GetGroupPostsQuery,
  GroupFragment,
} from 'generated/graphql';
import { NotFoundErrorPage } from 'components/layout/errors';
import { CreatePostForm, useCreatePostForm } from 'components/forms/CreatePost';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { CreatePostFormInputs } from 'types';
import { SubmitHandler } from 'react-hook-form';
import { stringToColour } from '../../src/lib/utils';
import { PostList } from '../../src/components/Post/PostList';

const GroupPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  group,
}) => {
  if (!group) return <NotFoundErrorPage />;

  return (
    <Layout current="groups">
      <div>
        <GroupBanner group={group} />
        <div className="bg-white border-b border-b-gray-200 py-2 px-6">
          <h2 className="text-xl font-medium">{group.name}</h2>
          <p className="text-base font-light">
            {group.description || 'Aucune description'}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-8 text-center">
        <div className="flex-auto p-3">
          <GroupContent groupId={group.id} />
        </div>
      </div>
    </Layout>
  );
};

const GroupBanner: FC<{ group: GroupFragment }> = ({ group }) => {
  const backgroundColor = useMemo(() => stringToColour(group.id), [group.id]);

  return (
    <div
      className="relative block w-full h-48 overflow-hidden"
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
  );
};

const GroupContent: FC<{ groupId: string }> = ({ groupId }) => {
  const form = useCreatePostForm();
  const {
    reset,
    formState: { isSubmitSuccessful, submitCount },
  } = form;
  const [createPost, { loading: createLoading }] = useCreatePostMutation({
    onError() {
      toast.error("Erreur lors de l'envoi du post");
    },
    onCompleted(newData) {
      cache.updateQuery<GetGroupPostsQuery, GetGroupPostsQueryVariables>(
        {
          query: GetGroupPostsDocument,
          variables: { id: groupId },
        },
        (data) => ({
          // @ts-expect-error
          posts: [newData.createPost, ...(data?.posts || [])],
        })
      );
      return true;
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [submitCount, isSubmitSuccessful, reset]);

  const { data, loading, fetchMore } = useGetGroupPostsQuery({
    variables: { id: groupId },
    onError() {
      toast.error('Erreur lors du chargement des posts');
    },
  });

  const handleSubmit: SubmitHandler<CreatePostFormInputs> = useCallback(
    ({ text, media }) => {
      return createPost({
        variables: {
          group: groupId,
          text,
          media,
        },
      });
    },
    [createPost, groupId]
  );

  const [loadMoreLoading, setLoadingMore] = useState(false);
  const handleLoadMore = useCallback(() => {
    if (data?.posts?.nextCursor) {
      setLoadingMore(true);
      fetchMore({
        variables: {
          cursor: data.posts.nextCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            posts: {
              nextCursor: (fetchMoreResult as GetGroupPostsQuery).posts
                .nextCursor,
              data: [
                ...(prev as GetGroupPostsQuery).posts.data,
                ...(fetchMoreResult as GetGroupPostsQuery).posts.data,
              ],
            },
          });
        },
      }).finally(() => setLoadingMore(false));
    }
  }, [data, fetchMore]);

  return (
    <div className="max-w-xl mx-auto">
      <CreatePostForm
        form={form}
        onSubmit={handleSubmit}
        loading={createLoading}
      />
      <PostList
        posts={data?.posts.data as PostType[]}
        loading={loading || loadMoreLoading}
        onLoadMore={handleLoadMore}
        skeletonNumber={1}
        hasNext={!!data?.posts.nextCursor}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  GetGroupInfoQuery,
  { id: string }
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const { id } = params;
  const context = await createApolloContext({ superUser: true });
  const apollo = await initializeApollo(null, context);

  const res = await apollo.query<GetGroupInfoQuery, GetGroupInfoQueryVariables>(
    {
      query: GetGroupInfoDocument,
      variables: {
        id,
      },
    }
  );

  if (!res.data.group) {
    return {
      notFound: true,
    };
  }

  return {
    props: JSON.parse(JSON.stringify(res.data)),
    revalidate: 1, // minute
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const [groups] = await prisma.$transaction([
    prisma.group.findMany({ select: { id: true } }),
  ]);

  const paths = groups.map((group) => ({
    params: { id: group.id },
  }));

  return { paths, fallback: 'blocking' };
};

GroupPage.auth = {};

export default GroupPage;
