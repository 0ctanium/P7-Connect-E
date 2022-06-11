import React, { FC } from 'react'
import {Field} from "../fields/Field";
import Link from "next/link";
import {SubmitHandler, useForm, UseFormProps, UseFormReturn} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {userCreateSchema} from "validators";
import {UserCreateInput} from "types";

interface SignUpFormProps {
    loading?: boolean,
    onSubmit: SubmitHandler<UserCreateInput>,
    form: UseFormReturn<UserCreateInput>
}

export const useSignUpForm = (props?: Partial<UseFormProps<UserCreateInput>>) => useForm<UserCreateInput>({
    ...props,
    resolver: yupResolver(userCreateSchema),
})

export const SignUpForm: FC<SignUpFormProps> = ({ loading, onSubmit, form}) => {
    const { register, handleSubmit, formState: { errors } } = form

    return (
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>

            <Field {...register('email')} error={errors.email?.message} id="email" type="email" autoComplete="email" label="Adresse email" fullWidth required />
            <Field {...register('password')} error={errors.password?.message} id="password" type="password" autoComplete="new-password" label="Mot de passe" fullWidth required />
            <Field {...register('passwordConfirm')} error={errors.passwordConfirm?.message} id="passwordConfirm" type="password" label="Confirmation" fullWidth required />

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Se souvenir de moi
                    </label>
                </div>

                <div className="text-sm">
                    <Link href="/forgot-password">
                        <a className="font-medium text-indigo-600 hover:text-indigo-500">
                            Mot de passe oublié ?
                        </a>
                    </Link>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="btn btn-primary btn-full"
                >
                    Connexion
                </button>
            </div>
        </form>
    );
}
