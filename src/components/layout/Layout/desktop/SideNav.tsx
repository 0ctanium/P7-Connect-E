import { FC } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/Avatar';

import { Tooltip } from 'components/Tooltip';
import { useSession } from 'next-auth/react';
import { LogoIcon } from 'components/Logo';
import { navigation, Navigation, NavigationPage } from 'constants/navigation';

interface SideNavProps {
  current: NavigationPage;
  onCurrentChange: (value: NavigationPage) => void;
}

export const SideNav: FC<SideNavProps> = ({ current, onCurrentChange }) => {
  const { data } = useSession<true>({ required: true });
  if (!data) {
    return null;
  }
  const { user } = data;

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-20">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-indigo-600">
          <div className="flex-1">
            <div className="py-4 flex items-center justify-center">
              <LogoIcon className="fill-white h-10 w-auto" />
            </div>
            <nav
              aria-label="Sidebar"
              className="py-6 flex flex-col items-center space-y-3">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  navigation={item}
                  onCurrentChange={onCurrentChange}
                  current={current}
                />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex pb-5">
            <Link href="/pages/profile">
              <a className="flex-shrink-0 w-full text-center">
                <Avatar user={user} />
                <div className="sr-only">
                  <p>{user.name}</p>
                  <p>Account settings</p>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavigationItemProps {
  navigation: Navigation;
  current: NavigationPage;
  onCurrentChange: (value: NavigationPage) => void;
}

export const NavigationItem: FC<NavigationItemProps> = ({
  navigation,
  current,
  onCurrentChange,
}) => {
  if (navigation.id === current) {
    return (
      <Tooltip
        render={navigation.name}
        className="tooltip-title"
        config={{ placement: 'right-start' }}>
        <Link href={navigation.href}>
          <a className="flex navigations-center p-4 rounded-lg text-indigo-200 hover:bg-indigo-700">
            {navigation.id === current ? (
              <navigation.currentIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <navigation.icon className="h-6 w-6" aria-hidden="true" />
            )}
            <span className="sr-only">{navigation.name}</span>
          </a>
        </Link>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip
        render={navigation.name}
        key={navigation.name}
        className="tooltip-title"
        config={{ placement: 'right-start' }}>
        <button
          onClick={() => onCurrentChange(navigation.id)}
          className="flex navigations-center p-4 rounded-lg text-indigo-200 hover:bg-indigo-700">
          {navigation.id === current ? (
            <navigation.currentIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <navigation.icon className="h-6 w-6" aria-hidden="true" />
          )}
          <span className="sr-only">{navigation.name}</span>
        </button>
      </Tooltip>
    );
  }
};
