import { yupResolver } from '@hookform/resolvers/yup';
import { Field } from 'components/fields/Field';
import { SwitchField } from 'components/fields/SwitchField';
import { FormDisclosure } from 'components/FormDisclosure';
import { SlideOver, SlideOverBody, SlideOverContainer, SlideOverContent, SlideOverFooter, SlideOverSection, SlideOverTitle } from 'components/SlideOver';
import React, {FC} from 'react'
import {Controller, SubmitHandler, UseFormProps, UseFormReturn} from 'react-hook-form';
import * as yup from "yup";

export interface NewGroupInputs {
    name: string;
    description?: string
    restricted: boolean
    banner?: (File & { preview: string }) | null;
}

export const newGroupSchema = yup.object<NewGroupInputs>({
    name: yup.string().required(),
    description: yup.string(),
    restricted: yup.boolean(),
    banner: yup.mixed<NewGroupInputs["banner"]>().nullable()
}).required();

export const defaultFormProps: UseFormProps<NewGroupInputs> = {
    resolver: yupResolver(newGroupSchema)
}

export const NewGroupSlideOver: FC<{ open: boolean, onClose(state: boolean): any, onSubmit: SubmitHandler<NewGroupInputs>, form: UseFormReturn<NewGroupInputs> }> = ({ open, onClose, onSubmit, form }) => {
    const { register, handleSubmit, control, formState: { errors } } = form

    return (
        <SlideOver open={open} onClose={onClose} className="max-w-md">
            {/* @ts-ignore */}
            <SlideOverBody<HTMLFormElement> as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <SlideOverContainer>
                    <SlideOverTitle
                        onClose={onClose}
                        title="Nouveau groupe officiel"
                        desc="Veuillez remplir les informations ci-dessous afin de créer un nouveau groupe officiel."
                    />

                    <SlideOverContent>
                        <SlideOverSection>
                            <div className="space-y-6 pt-6 pb-5">
                                <Field {...register('name')} error={errors.name?.message} id="name" label="Nom du groupe" type="text" required fullWidth />
                                <Field {...register('description')} error={errors.description?.message}  id="description" label="Description" type="text" minRows={4} hint="Optionnel" multiline fullWidth />

                                <div>

                                    <FormDisclosure label="Paramètres du groupe">
                                        <Controller
                                            name="restricted"
                                            control={control}
                                            render={({ field}) => (
                                                <SwitchField
                                                    label="Restreindre les publications"
                                                    desc="Seulement les administrateurs peuvent publier des posts."
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormDisclosure>
                                </div>
                            </div>

                        </SlideOverSection>
                    </SlideOverContent>
                </SlideOverContainer>
                <SlideOverFooter>
                    <button
                        type="button"
                        className="btn btn-white"
                        onClick={() => onClose(false)}
                    >
                        Anuler
                    </button>
                    <button
                        type="submit"
                        className="ml-4 btn btn-primary"
                    >
                        Créer
                    </button>
                </SlideOverFooter>
            </SlideOverBody>
        </SlideOver>
    );
}
