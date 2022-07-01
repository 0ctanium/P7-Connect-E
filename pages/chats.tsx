import { NextPage } from 'next';
import { Layout } from 'components/layout';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { NextSeo } from 'next-seo';

const Chats: NextPage = () => {
  return (
    <Layout current="chats" title="Discussions" showTitle>
      <NextSeo
        title="Discussions - Groupomania"
        description="Consultez vos messages privés"
      />
      <div className="flex-1 flex">
        <div className="m-auto flex flex-col items-center">
          <div className="bg-cosmos-500 rounded-full p-4 block mb-4">
            <HiOutlineInformationCircle className="text-scarlet-400 w-12 h-12" />
          </div>
          <p className="font-medium px-12 text-center">
            {"Cette fonctionnalité n'est pas disponible pour le moment."}
          </p>
        </div>
      </div>
    </Layout>
  );
};

Chats.auth = {};

export default Chats;
