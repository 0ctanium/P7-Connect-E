import React, {FC, useCallback} from 'react'
import {TableData, TableEdit, TableKey} from "../GroupsTable";
import {Tooltip} from "../../../../Tooltip";
import {GoVerified} from "react-icons/go";
import {CellComponent} from "types";
import {useTableCell} from "../../../../../hooks/useTable";
import {Field} from "../../../../fields/Field";



export const NameCell: CellComponent<TableData> = ({ row }) => {
    const {
        isEditing,
        editValues,
        edit
    } = useTableCell<TableData, TableKey, TableEdit>(row)

    const handeEdit: React.FormEventHandler<HTMLInputElement> = useCallback((e) => {
        const { value } = e.currentTarget

        edit({
            ...editValues,
            name: value
        })
    }, [edit, editValues])

    return (
        <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="w-10 h-10 rounded-full"
                    src={row.banner || ''}
                    alt=""
                />
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{row.name}</div>
            </div>
        </div>
    )
}
