import * as yup from 'yup';
import {
  CreatePostFormInputs,
  Media,
  NewGroupInputs,
  SignInInputs,
  UpdateGroupInputs,
  UserCreateInput,
} from 'types';

export const userCreateSchema = yup
  .object<UserCreateInput>({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    passwordConfirm: yup
      .string()
      .required()
      .test(
        'password-match',
        'Les mots de passe ne correspondent pas',
        function (value) {
          const { password } = this.parent;
          return password === value;
        }
      ),
  })
  .required();

export const signInSchema = yup
  .object<SignInInputs>({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
  .required();

export const updateGroupSchema = yup
  .object<UpdateGroupInputs>({
    name: yup.string().nullable(),
    description: yup.string().nullable(),
    restricted: yup.boolean().nullable(),
    banner: yup.mixed<Media>().nullable(),
  })
  .required();

export const newGroupSchema = yup
  .object<NewGroupInputs>({
    name: yup.string().required(),
    description: yup.string(),
    restricted: yup.boolean(),
    banner: yup.mixed<Media>().nullable(),
  })
  .required();

export const createPostSchema = yup
  .object<CreatePostFormInputs>({
    text: yup.string().required(),
    media: yup.array<Media>(yup.mixed<Media>()).nullable(),
  })
  .required();

export const editPostSchema = yup
  .object<CreatePostFormInputs>({
    text: yup.string().required(),
  })
  .required();
