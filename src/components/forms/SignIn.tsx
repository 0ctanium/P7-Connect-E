import React, { FC } from 'react'
import {Field} from "../fields/Field";
import Link from "next/link";
import {SubmitHandler, UseFormProps, UseFormReturn} from "react-hook-form";
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";

export interface Inputs {
    email: string;
    password: string
}

export const schema = yup.object<Inputs>({
    email: yup.string().required().email(),
    password: yup.string().required()
}).required();

export const defaultFormProps: UseFormProps<Inputs> = {
    resolver: yupResolver(schema)
}

interface FormProps {
    loading?: boolean,
    onSubmit: SubmitHandler<Inputs>,
    form: UseFormReturn<Inputs>
}

export const SignInForm: FC<FormProps> = ({ loading, onSubmit, form}) => {
    const { register, handleSubmit, formState: { errors } } = form

    return (
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>

            <Field {...register('email')} error={errors.email?.message} id="email" type="email" autoComplete="email" label="Adresse email" fullWidth required />
            <Field {...register('password')} error={errors.password?.message} id="password" type="password" autoComplete="current-password" label="Mot de passe" fullWidth required />

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
