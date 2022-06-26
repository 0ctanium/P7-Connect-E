import React, {useCallback, useMemo} from 'react'
import {TableData, TableEdit, TableKey} from "../UsersTable";
import {rolesConfig, Role} from "constants/role";
import clsx from "clsx";
import {Selection} from "../../../../fields/Selector";
import {CellComponent} from "types";
import {useTableCell} from "hooks";
import {RoleBadge} from "../../../../RoleBadge";

export const RoleCell: CellComponent<TableData> = ({ row }) => {
    const {
        isEditing,
        editValues,
        edit
    } = useTableCell<TableData, TableKey, TableEdit>(row)

    const options = useMemo(() => Object.values(Role).map(key => ({
        value: key,
        el: <RoleBadge className="badge-lg" role={key} />
    })),  [])

    const handleChange = useCallback((role: Role): void => {
        return edit({
            ...editValues,
            role: role
        });

    }, [edit, editValues])

    if(isEditing) {
        return <Selection<Role> options={options} selected={(editValues?.role || row.role) as Role} onChange={handleChange} />
    } else {
        return <RoleBadge className="badge-lg" role={row.role} />
    }
}
