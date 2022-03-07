import React from 'react'
import {UserTableData, UserTableEdit, UserTableKey} from "../UsersTable";
import {CellComponent} from "types";
import {useTableCell} from "hooks/useTable";

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
                <button className="text-red-600 hover:text-red-900" onClick={onDelete}>
                    Supprimer
                </button>
            </div>
        )
    }
}
