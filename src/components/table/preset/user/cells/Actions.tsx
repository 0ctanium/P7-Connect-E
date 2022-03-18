import React, {useCallback} from 'react'
import {TableData, TableEdit, TableKey} from "../UsersTable";
import {CellComponent} from "types";
import {useTableCell} from "hooks/useTable";
import {ConfirmButton} from "../../../../ConfirmButton";
import {isPromise} from "lib/utils";

export const Actions: CellComponent<TableData> = ({ row }) => {
    const {
        isEditing,
        setCurrentEditing,
        cancelEditing,
        submit,
        setRowLoading,
    } = useTableCell<TableData, TableKey, TableEdit>(row)

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
            </div>
        )
    }
}
