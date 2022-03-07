import React, {useCallback, useMemo} from 'react'
import {UserTableData, UserTableEdit, UserTableKey} from "../UsersTable";
import {roleClasses, Roles, rolesLabel} from "../../../../../constants";
import clsx from "clsx";
import {Selection} from "../../../../fields/Selector";
import {CellComponent} from "../../../../../types";
import {useTableCell} from "../../../../../hooks/useTable";

export const RoleCell: CellComponent<UserTableData> = ({ row }) => {
    const {
        isEditing,
        editValues,
        edit
    } = useTableCell<UserTableData, UserTableKey, UserTableEdit>(row)

    const options = useMemo(() => Object.values(Roles).map(key => ({
        value: key,
        el: <div className={clsx('badge-lg', roleClasses[key].badge)}>{rolesLabel[key]}</div>
    })),  [])

    const handleChange = useCallback((role: Roles): void => {
        console.log("role changed", role)
        return edit({
            ...(editValues || {} as UserTableEdit),
            role
        });

    }, [edit, editValues])

    if(isEditing) {
        return <Selection<Roles> options={options} selected={(editValues?.role || row.role) as Roles} onChange={handleChange} />
    } else {
        return <div className={clsx('badge-lg', roleClasses[row.role].badge)}>{rolesLabel[row.role]}</div>
    }
}
