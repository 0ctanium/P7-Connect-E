export interface UserCreateInput {
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface SignInInputs {
    email: string;
    password: string
}

export interface UpdateGroupInputs {
    name?: string | null;
    description?: string | null;
    restricted?: boolean | null;
    banner?: (File & { preview: string }) | null;
}


export interface NewGroupInputs {
    name: string;
    description?: string
    restricted: boolean
    banner?: (File & { preview: string }) | null;
}
