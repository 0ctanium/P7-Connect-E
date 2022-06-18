import React, {FC, HTMLProps} from 'react'
import {Role, rolesConfig} from "constants/role";
import clsx from "clsx";

export interface RoleBadgeProps extends HTMLProps<HTMLDivElement> {
    role: Role
}

export const RoleBadge: FC<RoleBadgeProps> = ({ role, className, ...props }) => {
    return <div {...props} className={clsx('badge', className, rolesConfig[role].classes.badge)}>{rolesConfig[role].label}</div>
}
