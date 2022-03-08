export enum Role {
    USER = 'USER',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN',
}

export interface RoleConfig {
    weight: number;
    label: string;
    classes: {
        badge: string
    }
}

export const rolesConfig: Record<Role, RoleConfig> = {
    [Role.ADMIN]: {
        weight: 100,
        label: "Administrateur",
        classes: {
            badge: 'badge-red'
        }
    },
    [Role.MODERATOR]: {
        weight: 10,
        label: "Modérateur",
        classes: {
            badge: 'badge-yellow'
        }
    },
    [Role.USER]: {
        weight: 1,
        label: "Membre",
        classes: {
            badge: 'badge-cyan'
        }
    },
}
