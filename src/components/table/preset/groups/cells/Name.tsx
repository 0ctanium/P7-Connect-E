import React, {useCallback} from 'react'
import {TableData, TableKey} from "../GroupsTable";
import {CellComponent} from "types";
import {useTableCell} from "hooks/useTable";
import Image from "next/image"
import {TableEdit} from "../../user/UsersTable";


export const NameCell: CellComponent<TableData> = ({ row }) => {
    const {
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
                {row.banner && <Image
                    className="w-10 h-10 rounded-full"
                    src={row.banner}
                    alt=""
                    height={40}
                    width={40}
                />}
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{row.name}</div>
            </div>
        </div>
    )
}
