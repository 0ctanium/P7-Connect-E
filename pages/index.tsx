import { useSession } from 'next-auth/react';
import { NextPage } from 'next';
import { Layout } from 'components/layout';
import { Post } from 'components/Post';
import {
  GetFeedQuery,
  Post as PostType,
  useGetFeedQuery,
} from 'generated/graphql';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { toast } from 'react-toastify';
import { PostList } from '../src/components/Post/PostList';
import { useCallback, useState } from 'react';
import { NextSeo } from 'next-seo';

const Home: NextPage = () => {
  const { data: session } = useSession<true>({ required: true });
  const { data, loading, fetchMore } = useGetFeedQuery({
    onError() {
      toast.error('Erreur lors du chargement des posts');
    },
  });

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
              nextCursor: (fetchMoreResult as GetFeedQuery).posts.nextCursor,
              data: [
                ...(prev as GetFeedQuery).posts.data,
                ...(fetchMoreResult as GetFeedQuery).posts.data,
              ],
            },
          });
        },
      }).finally(() => setLoadingMore(false));
    }
  }, [data, fetchMore]);

  if (!session) {
    return null;
  }

  return (
    <Layout current="feed">
      <NextSeo
        title="Fil d'actualité - Groupomania"
        description="Consultez tous les derniers posts"
      />
      <div className="flex justify-center mt-8 text-center">
        <PostList
          posts={data?.posts.data as PostType[]}
          loading={loading || loadMoreLoading}
          onLoadMore={handleLoadMore}
          skeletonNumber={1}
          hasNext={!!data?.posts.nextCursor}
        />
      </div>
    </Layout>
  );
};

Home.auth = {};

export default Home;
