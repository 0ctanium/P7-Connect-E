import React, { FC, useCallback, useMemo, useState } from 'react';
import { HiOutlineThumbUp } from 'react-icons/hi';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from '@headlessui/react';
import {
  ReactionCount,
  ReactionFragment,
  useRemoveReactionMutation,
  useSetReactionMutation,
} from 'generated/graphql';
import { toast } from 'react-toastify';
import { Post as PostType } from 'generated/graphql';
import { cache } from '../../services/apollo/client';
import clsx from 'clsx';
import { Icons, icons, iconsMap, ReactionIcon } from './ReactionIcon';

export const PostReactionSelector: FC<{
  post: PostType;
  className?: string;
}> = ({ post, className }) => {
  const updateReactionCount = useCallback(
    (reaction: ReactionFragment | null) => {
      cache.modify({
        id: `Post:${post.id}`,
        fields: {
          reactionCount(oldCache: ReactionCount[]) {
            const newCache = [...oldCache.map((oc) => ({ ...oc }))];
            const newIcon = reaction?.icon;
            const oldIcon = post.viewerReaction?.icon;

            const newIconIndex = oldCache.findIndex((c) => c.icon === newIcon);
            const oldIconIndex = oldCache.findIndex((c) => c.icon === oldIcon);

            if (newIcon) {
              if (newIconIndex !== -1 && newCache[newIconIndex]) {
                newCache[newIconIndex]['_count'] =
                  (newCache[newIconIndex]['_count'] || 0) + 1;
              } else {
                newCache.push({
                  icon: newIcon,
                  _count: 1,
                });
              }
            }

            if (oldIcon) {
              if (oldIconIndex !== -1 && newCache[oldIconIndex]) {
                newCache[oldIconIndex]['_count'] =
                  (newCache[oldIconIndex]['_count'] || 1) - 1;
              } else {
                newCache.push({
                  icon: oldIcon,
                  _count: 0,
                });
              }
            }

            return newCache;
          },
          viewerReaction() {
            return reaction?.id
              ? {
                  __ref: `Reaction:${reaction.id}`,
                }
              : null;
          },
        },
      });
    },
    [post.id, post.viewerReaction?.icon]
  );

  const [setReaction] = useSetReactionMutation({
    onError(err) {
      console.error(err);
      toast.error("Erreur de l'ajout de la reaction");
    },
    onCompleted(data) {
      if (data.setPostReaction) updateReactionCount(data.setPostReaction);
    },
  });
  const [removeReaction] = useRemoveReactionMutation({
    onError(err) {
      console.error(err);
      toast.error('Erreur du retrait de la reaction');
    },
    onCompleted() {
      updateReactionCount(null);
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  const selectedIconId = post.viewerReaction?.icon as Icons;
  const selectedIcon = useMemo(
    () => (selectedIconId ? icons[selectedIconId] : null),
    [selectedIconId]
  );

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      interactive: true,
      placement: 'top',
      delayShow: 500,
      delayHide: 250,
      visible: isVisible,
      onVisibleChange: setIsVisible,
    });

  const handleReact: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const target = event.currentTarget;
      if (target) {
        const iconId = target.getAttribute('data-icon');
        if (iconId) {
          setReaction({
            variables: {
              post: post.id,
              icon: iconId,
            },
          });
        }

        setIsVisible(false);
      }
    },
    [post.id, setReaction]
  );

  const handleRemoveReact = useCallback(() => {
    removeReaction({
      variables: {
        post: post.id,
      },
    });
  }, [post.id, removeReaction]);

  return (
    <>
      <button
        data-icon={selectedIcon ? selectedIconId : 'like'}
        onClick={selectedIcon ? handleRemoveReact : handleReact}
        className={clsx(
          'cursor-pointer transition-opacity flex justify-center items-center p-2 w-full',
          className
        )}
        ref={setTriggerRef}>
        {selectedIcon ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ReactionIcon
              className="w-5 h-5 mr-2"
              icon={selectedIconId}
              alt={`Vous avez réagi avec ${selectedIcon.label}`}
            />
            <p className={selectedIcon.className}>{selectedIcon.label}</p>
          </>
        ) : (
          <>
            <HiOutlineThumbUp className="h-5 w-5 mr-2" />
            {"J'aime"}
          </>
        )}
      </button>
      <Transition
        as="div"
        appear={true}
        unmount={false}
        show={visible}
        enter="transition-opacity duration-200 ease-in-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300 ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        role="tooltip"
        ref={setTooltipRef}
        {...getTooltipProps()}
        className="z-50 bg-white shadow border border-gray-200 flex flex-row gap-2 rounded-full p-2">
        {iconsMap.map((icon) => (
          <button
            key={icon.id}
            onClick={handleReact}
            data-icon={icon.id}
            className="group relative">
            <p className="transform bg-black/75 text-white text-sm rounded-full px-2 absolute -top-2.5 -translate-y-full left-1/2 -translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-0">
              {icon.label}
            </p>
            <ReactionIcon
              icon={icon.id}
              alt={`Réagir avec ${icon.label}`}
              className="w-8 h-8 transition ease-in-out group-hover:transform-gpu group-hover:scale-[1.17] group-hover:origin-bottom"
            />
          </button>
        ))}
      </Transition>
    </>
  );
};
