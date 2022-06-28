import React, { FC, useCallback } from 'react';
import { ConfirmButton } from 'components/ConfirmButton';
import { useReactTable } from 'hooks';
import { toast } from 'react-toastify';

export const DeleteAction: FC<{
  onDelete(userIds: string[]): Promise<any> | any;
}> = ({ onDelete }) => {
  const { dispatchLoadingAction, selectedRows } = useReactTable();

  const handleDeletion = useCallback(() => {
    dispatchLoadingAction(() => onDelete(selectedRows), selectedRows)
      .then(() => {
        toast.success('Les entrées ont étés supprimés avec succès');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Erreur interne');
      });
  }, [dispatchLoadingAction, onDelete, selectedRows]);

  return selectedRows.length > 0 ? (
    <ConfirmButton
      key={'delete'}
      className="btn-xs btn-white"
      dialogTitle="Êtes vous sûr de vouloir faire ça ?"
      dialogDesc="Cette action est irreversible. L'utilisateur pourra toujours recréer un utilisateur avec les mêmes comptes"
      confirmLabel="Supprimer l'utilisateur"
      onConfirm={handleDeletion}>
      Supprimer
    </ConfirmButton>
  ) : null;
};
