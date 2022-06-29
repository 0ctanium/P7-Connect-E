import React, { FC } from 'react';
import { Tooltip } from 'components/Tooltip';
import Link from 'next/link';
import { Navigation } from 'types';
import {
  HiChat as ChatIcon,
  HiUserGroup as UserGroupIcon,
  HiBell as BellIcon,
  HiOutlineChat as ChatIconOutline,
  HiOutlineUserGroup as UserGroupIconOutline,
  HiOutlineBell as BellIconOutline,
  HiOutlineNewspaper,
  HiNewspaper,
} from 'react-icons/hi';

const mobileNavigation: Navigation[] = [
  {
    id: 'feed',
    name: "Fil d'actualités",
    href: '/',
    icon: HiOutlineNewspaper,
    currentIcon: HiNewspaper,
  },
  {
    id: 'groups',
    name: 'Groupes',
    href: '/groups',
    icon: UserGroupIconOutline,
    currentIcon: UserGroupIcon,
  },
  {
    id: 'chats',
    name: 'Discussions',
    href: '/chats',
    icon: ChatIconOutline,
    currentIcon: ChatIcon,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    href: '/notifications',
    icon: BellIconOutline,
    currentIcon: BellIcon,
  },
];

interface BottomNavProps {
  current: string;
}

export const BottomNav: FC<BottomNavProps> = ({ current }) => {
  return (
    <div className="lg:hidden">
      <div className="bg-scarlet-600 py-2 px-4 sm:px-6 lg:px-8">
        <nav className="mx-auto md:max-w-md sm:max-w-sm max-w-xs flex flex-row items-center justify-between">
          {mobileNavigation.map((item) => (
            <Tooltip
              render={item.name}
              key={item.name}
              className="tooltip-title">
              <Link href={item.href}>
                <a className="h-12 w-12 inline-flex items-center justify-center bg-scarlet-600 rounded-md text-white hover:bg-scarlet-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {item.id === current ? (
                    <item.currentIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  )}
                  <span className="sr-only">{item.name}</span>
                </a>
              </Link>
            </Tooltip>
          ))}
        </nav>
      </div>
    </div>
  );
};
