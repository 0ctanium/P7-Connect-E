import React, {useCallback} from 'react'
import {UserTableData, UserTableEdit, UserTableKey} from "../UsersTable";
import {CellComponent} from "types";
import {useTableCell} from "hooks/useTable";
import {ConfirmButton} from "../../../../ConfirmButton";
import {isPromise} from "lib/utils";

export const Actions: CellComponent<UserTableData, { onDelete(userId: string): Promise<any> | any }> = ({ row, onDelete }) => {
    const {
        isEditing,
        setCurrentEditing,
        cancelEditing,
        submit,
        setRowLoading,
    } = useTableCell<UserTableData, UserTableKey, UserTableEdit>(row)

    const handleDelete = useCallback(() => {
        function done() {
            // done...
        }

        const res = onDelete(row.id) as Promise<void>

        if(isPromise(res)) {
            // Set loading state
            setRowLoading((state) => {
                return Array.from(new Set([...state, row.id]))
            })

            res.then(done).finally(() => {
                // Remove loading state
                setRowLoading((state) => {
                    return state.filter(k => k != row.id)
                })
            })
        } else { done() }
    }, [onDelete, row.id, setRowLoading])

    if(isEditing) {
        return (
            <div>
                <button className="text-gray-600 hover:text-gray-900 mr-4" onClick={cancelEditing}>
                    Annuler
                </button>
                <button className="text-indigo-600 hover:text-indigo-900" onClick={submit}>
                    Confirmer
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
                    onConfirm={handleDelete}>
                    Supprimer
                </ConfirmButton>
            </div>
        )
    }
}
