import React, {FC, useMemo} from 'react'
import {UserTableData} from "../UsersTable";
import {roleClasses, Roles, rolesLabel} from "../../../../../constants";
import clsx from "clsx";
import {Selection} from "../../../../fields/Selector";

export const RoleCell: FC<{ row: UserTableData, editing: boolean, onEdit(): void }> = ({ row, editing, onEdit }) => {
    const options = useMemo(() => Object.values(Roles).map(key => ({
        value: key,
        el: <div className={clsx('badge-lg', roleClasses[key].badge)}>{rolesLabel[key]}</div>
    })),  [])

    if(editing) {
        return <Selection<Roles> options={options} selected={row.role as Roles} onChange={(v) => {
            console.log(v)
        }} />
    } else {
        return <div className={clsx('badge-lg', roleClasses[row.role].badge)}>{rolesLabel[row.role]}</div>
    }
}
