import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  Post as PostType,
  useDeletePostMutation,
  useEditPostMutation,
} from 'generated/graphql';
import { Dropdown, DropdownActions } from 'components/Dropdown';
import { HiClipboard, HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';
import { useSession } from 'next-auth/react';
import { Role } from 'constants/role';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'components/ConfirmButton';
import { useConfirmButton } from 'hooks/useConfirmButton';
import { EditPostForm, useEditPostForm } from '../forms/EditPost';
import { EditPostFormInputs } from '../../types';
import { SubmitHandler } from 'react-hook-form';
import { cache } from 'services/apollo/client';

export const PostActions: FC<{
  post: PostType;
}> = ({ post }) => {
  const { data: session } = useSession<true>();
  const [deletePost, { loading: deleteLoading }] = useDeletePostMutation({
    onError(err) {
      console.error(err);
      toast.error('Erreur lors de la suppression du post');
    },
    onCompleted(res) {
      toast.success('Post supprimé');
      if (res.deletePost) {
        cache.evict({
          id: `Post:${res.deletePost}`,
        });
        cache.gc();
      }
    },
  });
  const [editPost, { loading: editLoading }] = useEditPostMutation({
    onError(err) {
      console.error(err);
      toast.error('Erreur lors de la modification du post');
    },
    onCompleted(res) {
      toast.success('Post modifié');
      setEditing(false);
    },
  });

  const handleCopy = useCallback(() => {
    copy(`https://${window.location.host}/post/${post.id}`);
    toast.success('Lien copié');
  }, [post.id]);

  const [isEditing, setEditing] = useState(false);
  const from = useEditPostForm({
    defaultValues: {
      text: post.text,
    },
  });

  const handleEdit: SubmitHandler<EditPostFormInputs> = useCallback(
    (data) => {
      editPost({
        variables: {
          post: post.id,
          text: data.text,
        },
      });
    },
    [editPost, post.id]
  );

  const { dismiss, confirm, close, isOpen, open } = useConfirmButton({
    onConfirm: () => {
      deletePost({
        variables: {
          post: post.id,
        },
      });
    },
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
        let userActions = [
          {
            as: 'button',
            className: 'w-full',
            label: 'Supprimer',
            icon: HiTrash,
            onClick: open,
          },
        ];

        if (session.user.id === post.authorId) {
          userActions = [
            {
              as: 'button',
              className: 'w-full',
              label: 'Modifier',
              icon: HiPencil,
              onClick: () => setEditing(true),
            },
            ...userActions,
          ];
        }

        return [...baseActions, userActions];
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
        loading={deleteLoading}
      />
      <EditPostForm
        open={isEditing}
        onClose={setEditing}
        form={from}
        onSubmit={handleEdit}
        loading={editLoading}
      />
    </>
  );
};
