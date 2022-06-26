import React, { FC, HTMLProps, useCallback, useMemo } from 'react';
import { Post as PostType } from 'generated/graphql';
import { Avatar, UserToolTip } from './Avatar';
import moment, { MomentInput } from 'moment';
import { Tooltip } from './Tooltip';
import Link from 'next/link';
import { Dropdown, DropdownActions } from './Dropdown';
import { HiClipboard, HiDotsVertical, HiTrash } from 'react-icons/hi';
import { useSession } from 'next-auth/react';
import { Role } from 'constants/role';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'components/ConfirmButton';
import { useConfirmButton } from '../hooks/useConfirmButton';

export const Post: FC<{ post: PostType; onDelete(postId: string): void }> = ({
  post,
  onDelete,
}) => {
  const { author, group } = post;

  return (
    <div className="bg-white rounded shadow px-8 py-4 flex flex-col">
      <div className="flex flex-row text-left h-10 mb-6">
        <Link href={`/profile/${author?.id}`}>
          <a>
            <Avatar user={author} showTooltip />
          </a>
        </Link>
        <div className="ml-4 flex flex-col items-start">
          <UserToolTip user={author}>
            <Link href={`/profile/${post.authorId}`}>
              <a className="text-base font-medium leading-6 hover:underline">
                {author?.name || 'Utilisateur inconnu'}
              </a>
            </Link>
          </UserToolTip>
          <Link href={`/post/${post.id}`}>
            <a>
              <PostDate
                date={post.createdAt}
                className="text-xs font-light hover:underline"
              />
            </a>
          </Link>
        </div>

        <div className="flex-grow" />

        <div className="-mr-4">
          <PostActions post={post} onDelete={onDelete} />
        </div>
      </div>

      <p className="text-left">{post.text}</p>
    </div>
  );
};

const PostActions: FC<{ post: PostType; onDelete(postId: string): void }> = ({
  post,
  onDelete,
}) => {
  const { data: session } = useSession<true>();

  const handleCopy = useCallback(() => {
    copy(`https://${window.location.host}/post/${post.id}`);
    toast.success('Lien copié');
  }, [post.id]);

  const { dismiss, confirm, close, isOpen, open } = useConfirmButton({
    onConfirm: () => onDelete(post.id),
  });

  const actions: DropdownActions = useMemo(() => {
    const baseActions = [
      [
        {
          as: 'button',
          className: 'w-full',
          icon: HiClipboard,
          label: 'Copier le lien du post',
          onClick: handleCopy,
        },
      ],
    ];

    if (session?.user) {
      if (
        session.user.id === post.authorId ||
        session.user.role === Role.MODERATOR ||
        session.user.role === Role.ADMIN
      ) {
        return [
          ...baseActions,
          [
            {
              as: 'button',
              className: 'w-full',
              label: 'Supprimer',
              icon: HiTrash,
              onClick: open,
            },
          ],
        ];
      }
    }

    return baseActions;
  }, [handleCopy, session, post.authorId, open]);

  return (
    <>
      <Dropdown menu={actions}>
        <div className="bg-white rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <span className="sr-only">Open options</span>
          <HiDotsVertical className="h-5 w-5" aria-hidden="true" />
        </div>
      </Dropdown>
      <ConfirmModal
        open={isOpen}
        onClose={close}
        onConfirm={confirm}
        onDismiss={dismiss}
        dialogTitle="Êtes-vous sûr de vouloir supprimer ce post ?"
        dialogDesc="Cette actions est irreversible. Une fois le post supprimé, aucun retour en arrière n'est possible."
        confirmLabel="Supprimer"
      />
    </>
  );
};

const PostDate: FC<{ date: MomentInput } & HTMLProps<HTMLParagraphElement>> = ({
  date,
  ...props
}) => {
  const calendar = useMemo(
    () =>
      moment(date).calendar({
        lastDay: '[hier à] LT',
        sameDay: 'LT',
        nextDay: '[demain à] LT',
        nextWeek: 'dddd [prochain à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: function (now) {
          if (moment(this as MomentInput).year() != moment(now).year()) {
            return 'D MMMM YYYY';
          } else {
            return '[le] D MMMM [à] LT';
          }
        },
      }),
    [date]
  );
  const completeDate = useMemo(
    () => moment(date).format('[le] dddd D MMMM YYYY [à] LT'),
    [date]
  );

  return (
    <Tooltip
      render={completeDate}
      className="tooltip-border-transparent tooltip-bg-gray-900/80 text-white text-xs font-light"
      config={{ delayShow: 200 }}>
      <p {...props}>{calendar}</p>
    </Tooltip>
  );
};
