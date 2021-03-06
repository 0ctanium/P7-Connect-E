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
import { signInSchema } from 'validators';
import { SignInInputs } from 'types';
import { LoadingSpinner } from '../LoadingSpinner';

interface SignInFormProps {
  loading?: boolean;
  onSubmit: SubmitHandler<SignInInputs>;
  form: UseFormReturn<SignInInputs>;
}

export const useSignInForm = (props?: Partial<UseFormProps<SignInInputs>>) =>
  useForm<SignInInputs>({
    ...props,
    resolver: yupResolver(signInSchema),
  });

export const SignInForm: FC<SignInFormProps> = ({
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
        autoComplete="current-password"
        label="Mot de passe"
        fullWidth
        required
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-fiord-600 focus:ring-fiord-500 border-gray-300 rounded"
          />
          {/* TODO: make feature */}
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900">
            Se souvenir de moi
          </label>
        </div>

        <div className="text-sm">
          {/* TODO: make feature */}
          <Link href="/forgot-password">
            <a className="font-medium text-fiord-600 hover:text-fiord-500">
              Mot de passe oubli?? ?
            </a>
          </Link>
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-primary btn-full">
          Connexion
          {loading && <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />}
        </button>
      </div>
    </form>
  );
};
