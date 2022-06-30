import React, { FC, useMemo } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { GroupFragment, useGetAllGroupsQuery } from 'generated/graphql';
import {
  HiBell,
  HiChat,
  HiNewspaper,
  HiOutlineMailOpen,
  HiPencilAlt,
} from 'react-icons/hi';
import { Tooltip } from 'components/Tooltip';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { stringToColour } from '../../../../lib/utils';
import { useRouter } from 'next/router';
import clsx from 'clsx';

interface SideBarProps {
  current: string;
}

export const SideBar: FC<SideBarProps> = ({ current }) => {
  switch (current) {
    case 'feed':
      return <HomeSideBar />;
    case 'notifications':
      return <NotificationsSideBar />;
    case 'chats':
      return <ChatsSideBar />;
    default:
      return <HomeSideBar />;
  }
};

const HomeSideBar: FC = () => {
  const { loading, data } = useGetAllGroupsQuery();
  const { pathname } = useRouter();

  if (loading) {
    return <LoadingSpinner className="w-6 h-6" />;
  }

  const groups = data?.groups || [];

  return (
    <div className="py-6">
      <h2 className="px-8 text-2xl font-bold">Accueil</h2>
      <Link href={`/`}>
        <a
          className={clsx(
            'px-8 py-1  flex items-center',
            pathname === '/'
              ? 'bg-gray-200/80 hover:bg-gray-200'
              : 'hover:bg-gray-100'
          )}>
          <HiNewspaper className="w-10 h-10 p-1.5 text-indigo-400 mr-4" />
          <p className="font-medium">{"Fil d'actualité"}</p>
        </a>
      </Link>

      <h3 className="px-8 text-xl font-medium mt-6">Groupes</h3>
      <ul className="my-2">
        {groups.map((group) => (
          <li key={group.id}>
            <GroupItem group={group} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const GroupItem: FC<{ group: GroupFragment }> = ({ group }) => {
  const backgroundColor = useMemo(() => stringToColour(group.id), [group.id]);
  const { pathname, query } = useRouter();

  const current = pathname === '/groups/[id]' && query.id === group.id;

  return (
    <Link href={`/groups/${group.id}`}>
      <a
        className={clsx(
          'px-8 py-1  flex items-center',
          current ? 'bg-gray-200/80 hover:bg-gray-200' : 'hover:bg-gray-100'
        )}>
        <div
          className="block w-10 h-10 rounded-lg overflow-hidden mr-4"
          style={{ backgroundColor }}>
          {group.banner && (
            <Image
              src={group.banner}
              alt={`Bannière du groupe ${group.name}`}
              width={40}
              height={40}
            />
          )}
        </div>
        <p className="font-medium">{group.name}</p>
      </a>
    </Link>
  );
};

const NotificationsSideBar: FC = () => {
  return (
    <>
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold inline">Notifications</h2>
          <Tooltip
            render="Tout marquer comme lu"
            className="tooltip-title"
            config={{ placement: 'left' }}>
            <button className="rounded-full bg-gray-200 text-black p-2 hover:bg-gray-300">
              <HiOutlineMailOpen className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 px-8 pb-6 flex">
        <div className="m-auto flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 block mb-4">
            <HiBell className="text-indigo-400 w-12 h-12" />
          </div>
          <p className="font-medium">{"Vous n'avez aucune notification..."}</p>
        </div>
      </div>
    </>
  );
};

const ChatsSideBar: FC = () => {
  return (
    <>
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold inline">Discussions</h2>
          <Tooltip
            render="Créer une discussion"
            className="tooltip-title"
            config={{ placement: 'left' }}>
            <button
              onClick={() =>
                toast.warning(
                  "Cette fonctionnalité n'est pas encore prise en compte."
                )
              }
              className="rounded-full bg-gray-200 text-black p-2 hover:bg-gray-300">
              <HiPencilAlt className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 px-8 pb-6 flex">
        <div className="m-auto flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 block mb-4">
            <HiChat className="text-indigo-400 w-12 h-12" />
          </div>
          <p className="font-medium">{"Vous n'avez aucune discussion..."}</p>
        </div>
      </div>
    </>
  );
};
