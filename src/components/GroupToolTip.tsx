import React, { FC, useMemo } from 'react';
import { Tooltip } from './Tooltip';
import { Group, User } from 'generated/graphql';
import Image from 'next/image';
import { stringToColour } from '../lib/utils';

interface GroupToolTipProps {
  group: Group;
}

export const GroupToolTip: FC<GroupToolTipProps> = ({ group, children }) => {
  const backgroundColor = useMemo(() => stringToColour(group.id), [group.id]);

  const content = (
    <div className="flex flex-col text-left">
      <div
        className="relative grid w-full w-full h-32"
        style={{ backgroundColor }}>
        {group.banner && (
          <Image
            src={group.banner}
            alt={`Bannière du groupe ${group.name}`}
            width={128}
            height={128}
            objectFit="cover"
          />
        )}
      </div>
      <div className="px-4 py-1 group-hover:underline">
        <p className="text-lg font-medium leading-1">{group.name}</p>
        <p className="text-sm font-light">
          {group.description || 'Aucune description'}
        </p>
      </div>
    </div>
  );

  return (
    <Tooltip
      className="overflow-hidden p-0 border-0"
      render={content}
      config={{
        delayShow: 400,
        delayHide: 150,
        interactive: true,
      }}>
      {children}
    </Tooltip>
  );
};
