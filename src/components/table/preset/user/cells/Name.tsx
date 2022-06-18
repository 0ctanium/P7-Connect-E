import React, {FC, useCallback} from 'react'
import {TableData, TableEdit, TableKey} from "../UsersTable";
import {Tooltip} from "../../../../Tooltip";
import {GoVerified} from "react-icons/go";
import {CellComponent} from "types";
import {useTableCell} from "../../../../../hooks/useTable";
import {Field} from "../../../../fields/Field";
import {Avatar} from "../../../../Avatar";



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
                <Avatar user={row} />
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                    {isEditing ? <Field type="text" name="name" onChange={handeEdit} value={editValues?.name || row.name || ''} /> : row.name}
                </div>
                <div className="flex flex-row items-center text-sm text-gray-500">
                    {row.emailVerified && (
                        <Tooltip className="tooltip-bg-gray-900/80 text-xs font-light text-white" render="Email confirmé">
                            <GoVerified
                                className="mr-1.5 w-4 h-4 text-gray-400"
                                aria-hidden="true"
                            />
                        </Tooltip>
                    )}
                    {row.email}
                </div>
            </div>
        </div>
    )
}
