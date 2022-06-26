import {FC} from "react";
import {Field} from "../fields/Field";
import {SubmitHandler, useForm, UseFormProps, UseFormReturn} from "react-hook-form";
import {CreatePostFormInputs} from "types";
import {yupResolver} from "@hookform/resolvers/yup";
import {createPostSchema} from "validators";
import {Avatar} from "../Avatar";
import {useSession} from "next-auth/react";
import {LoadingSpinner} from "../LoadingSpinner";

export interface CreatePostFormProps {
    loading?: boolean,
    onSubmit: SubmitHandler<CreatePostFormInputs>
    form: UseFormReturn<CreatePostFormInputs>
}

export const useCreatePostForm = (props?: Partial<UseFormProps<CreatePostFormInputs>>) => {
    return useForm<CreatePostFormInputs>({
        ...props,
        resolver: yupResolver(createPostSchema),
    })
}

export const CreatePostForm: FC<CreatePostFormProps> = ({ form, onSubmit, loading }) => {
    const { data } = useSession<true>({ required: true })
    const { register, handleSubmit, formState: { errors } } = form

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded shadow mb-4">
            <div className="px-8 py-4 flex flex-row">
                <Avatar user={data?.user} className="mr-2" />
                <div className="flex-grow pt-px">
                  <Field {...register('text')} error={errors.text?.message} id="text" placeholder="Écrivez quelque-chose" type="text" required fullWidth multiline />
                </div>
            </div>
            <div className="px-8 py-2 border-t border-t-gray-200 flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm">Envoyer {loading && <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />}</button>
            </div>
        </form>
    )
}
