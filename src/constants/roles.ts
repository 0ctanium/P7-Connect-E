export enum Roles {
    USER = 'USER',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN',
}

interface RoleComponentsClasses {
    badge: string
}

export const rolesLabel = {
    [Roles.ADMIN]: "Administrateur",
    [Roles.MODERATOR]: "Modérateur",
    [Roles.USER]: "Membre",
}


export const roleClasses: Record<Roles, RoleComponentsClasses> = {
    [Roles.USER]: {
        badge: 'badge-cyan'
    },
    [Roles.MODERATOR]: {
        badge: 'badge-yellow'
    },
    [Roles.ADMIN]: {
        badge: 'badge-red'
    }
}
