import React, {FC,useCallback, useEffect, useRef, useState} from 'react'
import {GroupFragment} from "generated/graphql";
import {Field} from "components/fields/Field";
import {SwitchField} from "components/fields/SwitchField";
import {Controller, SubmitHandler, useForm, useWatch} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {useDropzone} from "react-dropzone";
import clsx from "clsx";
import { isPromise } from "lib/utils";
import { Section } from "components/Section";
import {LoadingSpinner} from "components/LoadingSpinner";
import {AdminLayoutSection} from "components/layout/Admin";
import {toast} from "react-toastify";
import {UpdateGroupInputs} from "types";
import {updateGroupSchema} from "validators";

export const UpdateGroupForm: FC<{ group: GroupFragment, onUpdate(d: UpdateGroupInputs): any | Promise<any> }> = ({ group, onUpdate }) => {
    const defaultValues = {
        ...group,
        banner: null
    }

    const { register, handleSubmit, control, reset, formState, setValue } = useForm<UpdateGroupInputs>({
        defaultValues,
        resolver: yupResolver(updateGroupSchema)
    });
    const banner = useWatch({
        control,
        name: 'banner'
    })

    const [loading, setLoading] = useState(false)

    const dirtyFields = useRef<UpdateGroupInputs>(null);
    useEffect(() => {
        // @ts-ignore
        dirtyFields.current = formState.dirtyFields;
    });

    const onSubmit: SubmitHandler<UpdateGroupInputs> = useCallback((data) => {
        if(!dirtyFields?.current) {
            toast.warn("Impossible de lire les modifications apportés")
            return
        }

        const values = Object.entries(data).reduce((acc, [key, val]) => {
            // @ts-ignore
            if(dirtyFields.current[key] === true) {
                // @ts-ignore
                acc[key] = val
            }

            return acc
        }, {})
        // @ts-ignore
        if(banner) values['banner'] = banner

        if(!Object.keys(values).length) {
            toast.warn("Aucune modification n'a été apporté")
            return
        }

        const res =  onUpdate(values) as Promise<void>
        if(isPromise(res)) {
            // Set loading state
            setLoading(true)

            res.finally(() => {
                // Remove loading state
                setLoading(false)
            })
        }
    }, [banner, onUpdate])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        multiple: false,
        maxSize: 10000000, // 10 MB
        onDropAccepted: ([file]) => {
            setValue('banner', Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
        },
        onDropRejected: (rejection) => {
            rejection[0].errors.forEach((err) => {
                switch (err.code) {
                    case "file-invalid-type":
                        toast.error("Le format du fichier n'est pas accepté")
                        break;
                    case "file-too-large":
                        toast.error("Le fichier est trop volumineux")
                        break;
                    case "file-too-small":
                        toast.error("Le fichier est trop peu volumineux")
                        break;
                    case "too-many-files":
                        toast.error("Trop de fichiers ont étés téléchargés")
                        break;
                    default:
                        toast.error("Impossible de télécharger l'image")
                        break;
                }

            })
        }
    })

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        if(banner) URL.revokeObjectURL(banner.preview);
    }, [banner]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Section title="Configuration" desc="Ces informations sont disponibles publiquement. Soyez vigilant aux informations que vous entrez.">
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                            <Field {...register('name')}
                                   label="Nom du groupe"
                                   type="text"
                                   id="name"
                                   fullWidth/>
                        </div>
                    </div>

                    <Field {...register('description')}
                           label="Description"
                           type="text"
                           id="description"
                           minRows={3}
                           desc="Donnez une breve description de votre groupe"
                           fullWidth
                           multiline
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo de couverture</label>
                        <div {...getRootProps()} className={clsx(
                            'relative overflow-hidden mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md object-contain min-h-[140px]',
                            (isDragActive) ? 'border-indigo-600' : 'border-gray-300' )}
                             style={{ background: banner?.preview ? `url(${banner.preview})` : undefined }}>
                            {/*{banner && <img src={banner.preview} alt="Preview" className="absolute w-full h-full inset-0" />}*/}
                            <div className={clsx('space-y-1 text-center', banner && 'sr-only')}>
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="banner"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Télécharger un fichier</span>
                                        <input id="banner" className="sr-only" {...getInputProps()} />
                                    </label>
                                    <p className="pl-1">ou glisser-déposer</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu{"'"}à 10Mo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Configuration" desc="Paramétrez le fonctionnement du groupe.">
                <div className="space-y-6">
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
                </div>
            </Section>

            <AdminLayoutSection>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => reset(defaultValues)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Réinitialiser
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sauvegarder
                        {loading &&  <LoadingSpinner className="w-6 h-6" />}
                    </button>
                </div>
            </AdminLayoutSection>
        </form>
    )
}
