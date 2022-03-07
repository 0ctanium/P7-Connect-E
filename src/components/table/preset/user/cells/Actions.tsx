import React, {FC, useCallback} from 'react'
import {UserTableData} from "../UsersTable";

export const Actions: FC<{ row: UserTableData, editing: boolean, onEdit(userId: string): void, onCancel(): void, onSubmit(): void }> = ({ row, editing, onEdit, onCancel, onSubmit }) => {
    const handleEdit: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        const id = event.currentTarget.getAttribute('data-id');

        if(id) onEdit(id)
    }, [onEdit])

    const handleDelete = useCallback(() => {

    }, [])

    if(editing) {
        return (
            <div>
                <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={onSubmit}>
                    Confirmer
                </button>
                <button className="text-gray-600 hover:text-gray-900" onClick={onCancel}>
                    Annuler
                </button>
            </div>
        )
    } else {
        return (
            <div>
                <button data-id={row.id} className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={handleEdit}>
                    Editer
                </button>
                <button data-id={row.id} className="text-red-600 hover:text-red-900" onClick={handleDelete}>
                    Supprimer
                </button>
            </div>
        )
    }
}
