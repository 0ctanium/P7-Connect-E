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
} from 'react-icons/hi';
import { IconType } from 'react-icons';

export type NavigationPage = 'feed' | 'groups' | 'notifications' | 'chats';
export interface Navigation {
  id: NavigationPage;
  name: string;
  href: string;
  icon: IconType;
  currentIcon: IconType;
}

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
