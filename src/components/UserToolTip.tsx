import React, { FC } from 'react';
import { RoleBadge } from './RoleBadge';
import { Tooltip } from './Tooltip';
import { User } from 'generated/graphql';
import { Avatar } from './Avatar';

interface UserToolTipProps {
  user?: Partial<User> | null;
}

export const UserToolTip: FC<UserToolTipProps> = ({ user, children }) => {
  const content = (
    <div className="flex justify-between px-4 py-1">
      <div className="mr-4">
        <p className="text-base">{user?.name || 'Utilisateur inconnu'}</p>
        {user?.role && <RoleBadge role={user.role} />}
      </div>
      <Avatar user={user} size="2xl" showStatus />
    </div>
  );

  return (
    <Tooltip
      render={content}
      config={{ delayShow: 400, delayHide: 150, interactive: true }}>
      {children}
    </Tooltip>
  );
};
