import { NextPage } from 'next';
import { Layout } from 'components/layout';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const Chats: NextPage = () => {
  return (
    <Layout current="chats" title="Discussions" showTitle>
      <div className="flex-1 flex">
        <div className="m-auto flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 block mb-4">
            <HiOutlineInformationCircle className="text-indigo-400 w-12 h-12" />
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
