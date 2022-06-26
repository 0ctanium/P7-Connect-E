import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import { Layout } from 'components/layout';
import prisma from 'services/prisma';
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
  useDeletePostMutation,
} from 'generated/graphql';
import { NotFoundErrorPage } from 'components/layout/errors';
import { Post } from 'components/Post';
import { CreatePostForm, useCreatePostForm } from 'components/forms/CreatePost';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { CreatePostFormInputs } from 'types';
import { SubmitHandler } from 'react-hook-form';

const GroupPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  group,
}) => {
  if (!group) return <NotFoundErrorPage />;

  return (
    <Layout current="feed">
      <div>
        <div className="relative w-full h-48">
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

const GroupContent: FC<{ groupId: string }> = ({ groupId }) => {
  const form = useCreatePostForm();
  const [createPost, { loading: createLoading }] = useCreatePostMutation({
    onError() {
      toast.error("Erreur lors de l'envoi du post");
    },
    onCompleted(newData) {
      return cache.updateQuery<GetGroupPostsQuery, GetGroupPostsQueryVariables>(
        {
          query: GetGroupPostsDocument,
          variables: { id: groupId },
        },
        (data) => ({
          // @ts-expect-error
          posts: [newData.createPost, ...(data?.posts || [])],
        })
      );
    },
  });

  const { data, loading } = useGetGroupPostsQuery({
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
        },
      }).finally(() => {
        form.reset();
      });
    },
    [createPost, form, groupId]
  );

  if (loading) return <LoadingSpinner />;

  if (!data) return <p>Ce groupe ne contient aucun post</p>;

  return (
    <div className="max-w-xl mx-auto">
      <CreatePostForm
        form={form}
        onSubmit={handleSubmit}
        loading={createLoading}
      />
      <div className="space-y-4">
        {data.posts.map((post) => (
          <Post post={post as PostType} key={post.id} />
        ))}
      </div>
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
  const context = await createApolloContext(null);
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
    props: res.data,
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
