import {
  HiHome as HomeIcon,
  HiChat as ChatIcon,
  HiBell as BellIcon,
  HiOutlineHome as HomeIconOutline,
  HiOutlineChat as ChatIconOutline,
  HiOutlineBell as BellIconOutline,
  HiUserGroup as UserGroupIcon,
  HiOutlineUserGroup as UserGroupIconOutline,
  HiOutlineNewspaper,
  HiNewspaper,
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiOutlineCog,
} from 'react-icons/hi';
import { IconType } from 'react-icons';
import { DropdownActions } from '../components/Dropdown';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Role } from './role';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export type NavigationPage =
  | 'feed'
  | 'groups'
  | 'notifications'
  | 'chats'
  | 'profile';
export interface Navigation {
  id: NavigationPage;
  name: string;
  href: string;
  icon: IconType;
  currentIcon: IconType;
}

export const useUserDropDown = () => {
  const { data: session } = useSession<true>({ required: true });
  const { push } = useRouter();

  return useMemo(() => {
    const actions: DropdownActions = [
      {
        as: 'button',
        className: 'w-full',
        label: 'Modifier le profil',
        icon: HiOutlineUserCircle,
        onClick: () => {
          toast.info(
            'Veuillez contacter un administrateur pour modifier vos informations.'
          );
        },
      },
      {
        as: 'button',
        className: 'w-full',
        label: 'Déconnexion',
        icon: HiOutlineLogout,
        onClick: () => {
          signOut();
        },
      },
    ];

    if (
      session?.user.role === Role.ADMIN ||
      session?.user.role === Role.MODERATOR
    ) {
      actions.unshift({
        as: 'button',
        className: 'w-full',
        label: 'Dashboard administrateur',
        icon: HiOutlineCog,
        onClick: () => {
          push('/admin');
        },
      });
    }

    return actions;
  }, [push, session?.user.role]);
};

export const navigation: Navigation[] = [
  {
    id: 'feed',
    name: 'Accueil',
    href: '/',
    icon: HomeIconOutline,
    currentIcon: HomeIcon,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    href: '/notifications',
    icon: BellIconOutline,
    currentIcon: BellIcon,
  },
  {
    id: 'chats',
    name: 'Discussions',
    href: '/chats',
    icon: ChatIconOutline,
    currentIcon: ChatIcon,
  },
];

export function parseCurrentNavToDesktop(
  current: NavigationPage
): NavigationPage {
  if (current === 'groups') return 'feed';

  return current;
}

export const mobileNavigation: Navigation[] = [
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

export function parseCurrentNavToMobile(
  current: NavigationPage
): NavigationPage {
  return current;
}
