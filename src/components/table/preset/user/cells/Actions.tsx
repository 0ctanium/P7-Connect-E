import React from 'react'
import {UserTableData, UserTableEdit, UserTableKey} from "../UsersTable";
import {CellComponent} from "types";
import {useTableCell} from "hooks/useTable";
import {ConfirmButton} from "../../../../ConfirmButton";

export const Actions: CellComponent<UserTableData, { onDelete(): void }> = ({ row, onDelete }) => {
    const {
        isEditing,
        setCurrentEditing,
        cancelEditing,
        submit,
    } = useTableCell<UserTableData, UserTableKey, UserTableEdit>(row)

    if(isEditing) {
        return (
            <div>
                <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={submit}>
                    Confirmer
                </button>
                <button className="text-gray-600 hover:text-gray-900" onClick={cancelEditing}>
                    Annuler
                </button>
            </div>
        )
    } else {
        return (
            <div>
                <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={setCurrentEditing}>
                    Éditer
                </button>
                <ConfirmButton
                    className="text-red-600 hover:text-red-900"
                    dialogTitle="Êtes vous sûr de vouloir faire ça ?"
                    dialogDesc="Cette action est irreversible. L'utilisateur pourra toujours recréer un utilisateur avec les mêmes comptes"
                    confirmLabel="Supprimer l'utilisateur"
                    onConfirm={onDelete}>
                    Supprimer
                </ConfirmButton>
            </div>
        )
    }
}
