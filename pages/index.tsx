import { useSession } from 'next-auth/react';
import { NextPage } from 'next';
import { Layout } from 'components/layout';
import { Post } from 'components/Post';
import { Post as PostType, useGetFeedQuery } from 'generated/graphql';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { toast } from 'react-toastify';

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

  if (loading) return <LoadingSpinner />;

  return (
    <Layout current="feed">
      <div className="flex justify-center mt-8 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          {data?.posts?.map((post) => (
            <Post post={post as PostType} key={post.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

Home.auth = {};

export default Home;
