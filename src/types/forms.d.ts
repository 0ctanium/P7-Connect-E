export interface UserCreateInput {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignInInputs {
  email: string;
  password: string;
}

export type Media = (File & { preview: string }) | null;
export interface UpdateGroupInputs {
  name?: string | null;
  description?: string | null;
  restricted?: boolean | null;
  banner?: Media;
}

export interface NewGroupInputs {
  name: string;
  description?: string;
  restricted: boolean;
  banner?: Media;
}

export interface CreatePostFormInputs {
  text: string;
  media?: Media[] | null;
}

export interface EditPostFormInputs {
  text: string;
  media?: Media[] | null;
}
