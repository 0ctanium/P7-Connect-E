import React, { FC } from 'react';
import { Field } from '../fields/Field';
import Link from 'next/link';
import {
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userCreateSchema } from 'validators';
import { UserCreateInput } from 'types';

interface SignUpFormProps {
  loading?: boolean;
  onSubmit: SubmitHandler<UserCreateInput>;
  form: UseFormReturn<UserCreateInput>;
}

export const useSignUpForm = (props?: Partial<UseFormProps<UserCreateInput>>) =>
  useForm<UserCreateInput>({
    ...props,
    resolver: yupResolver(userCreateSchema),
  });

export const SignUpForm: FC<SignUpFormProps> = ({
  loading,
  onSubmit,
  form,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Field
        {...register('email')}
        error={errors.email?.message}
        id="email"
        type="email"
        autoComplete="email"
        label="Adresse email"
        fullWidth
        required
      />
      <Field
        {...register('password')}
        error={errors.password?.message}
        id="password"
        type="password"
        autoComplete="new-password"
        label="Mot de passe"
        fullWidth
        required
      />
      <Field
        {...register('passwordConfirm')}
        error={errors.passwordConfirm?.message}
        id="passwordConfirm"
        type="password"
        label="Confirmation"
        fullWidth
        required
      />

      <div>
        <button type="submit" className="btn btn-primary btn-full">
          Inscription
        </button>
      </div>
    </form>
  );
};
