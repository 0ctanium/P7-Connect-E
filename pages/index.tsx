import { useSession } from 'next-auth/react';
import { NextPage } from 'next';
import { Layout } from 'components/layout';
import { Post } from 'components/Post';
import { Post as PostType, useGetFeedQuery } from 'generated/graphql';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { toast } from 'react-toastify';
import { PostList } from '../src/components/Post/PostList';

const Home: NextPage = () => {
  const { data: session } = useSession<true>({ required: true });
  const { data, loading } = useGetFeedQuery({
    onError() {
      toast.error('Erreur lors du chargement des posts');
    },
  });

  if (!session) {
    return null;
  }

  return (
    <Layout current="feed">
      <div className="flex justify-center mt-8 text-center">
        <PostList posts={data?.posts as PostType[]} loading={loading} />
      </div>
    </Layout>
  );
};

Home.auth = {};

export default Home;
