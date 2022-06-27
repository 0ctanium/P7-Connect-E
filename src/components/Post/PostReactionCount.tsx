import React, { FC, useMemo } from 'react';
import { ReactionCount } from 'generated/graphql';
import { Icons, icons, ReactionIcon } from './ReactionIcon';
import { Tooltip } from '../Tooltip';

export const PostReactionCount: FC<{ counts: ReactionCount[] }> = ({
  counts = [],
}) => {
  const l = counts.length;
  const totalCount = useMemo(() => {
    return counts.reduce((acc, curr) => acc + curr._count, 0);
  }, [counts]);

  const reactionInfos = (
    <div className="flex flex-col gap-y-2m">
      {counts.map((count, i) => {
        const iconId = count.icon as Icons;
        const icon = icons[iconId];

        if (count._count === 0) return null;

        return (
          <div key={iconId} className="flex items-center">
            <ReactionIcon
              icon={iconId}
              alt={`${count._count} on réagi avec ${icon.label}`}
              className="w-5 h-5 rounded-full ring-2 ring-white inline-block"
              style={{ zIndex: 3 + l - i }}
            />
            <span className="text-gray-400 text-sm ml-1">{count._count}</span>
          </div>
        );
      })}
    </div>
  );

  if (!totalCount) return <div />;

  return (
    <Tooltip render={reactionInfos}>
      <div className="flex items-center hover:underline">
        <div className="flex flex-row -space-x-1 overflow-hidden">
          {counts.map((count, i) => {
            const iconId = count.icon as Icons;
            const icon = icons[iconId];

            if (count._count === 0) return null;

            return (
              <ReactionIcon
                key={iconId}
                icon={iconId}
                alt={`${count._count} on réagi avec ${icon.label}`}
                className="w-5 h-5 rounded-full ring-2 ring-white inline-block"
                style={{ zIndex: 3 + l - i }}
              />
            );
          })}
        </div>
        <span className="ml-2 text-sm text-gray-400">{totalCount}</span>
      </div>
    </Tooltip>
  );
};
