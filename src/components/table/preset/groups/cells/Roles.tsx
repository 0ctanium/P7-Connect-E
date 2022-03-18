import React, {useCallback, useMemo} from 'react'
import {TableData, TableEdit, TableKey} from "../GroupsTable";
import {rolesConfig, Role} from "../../../../../constants";
import clsx from "clsx";
import {Selection} from "../../../../fields/Selector";
import {CellComponent} from "../../../../../types";
import {useTableCell} from "../../../../../hooks/useTable";

export const RoleCell: CellComponent<TableData> = ({ row }) => {
    const {
        isEditing,
        editValues,
        edit
    } = useTableCell<TableData, TableKey, TableEdit>(row)

    const options = useMemo(() => Object.values(Role).map(key => ({
        value: key,
        el: <div className={clsx('badge-lg', rolesConfig[key].classes.badge)}>{rolesConfig[key].label}</div>
    })),  [])

    const handleChange = useCallback((role: Role): void => {
        return edit({
            ...editValues,
            role
        });

    }, [edit, editValues])

    if(isEditing) {
        return <Selection<Role> options={options} selected={(editValues?.role || row.role) as Role} onChange={handleChange} />
    } else {
        return <div className={clsx('badge-lg', rolesConfig[row.role].classes.badge)}>{rolesConfig[row.role].label}</div>
    }
}