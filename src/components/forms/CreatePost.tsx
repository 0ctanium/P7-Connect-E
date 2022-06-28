import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Field } from '../fields/Field';
import {
  Control,
  SubmitHandler,
  useController,
  UseControllerProps,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { CreatePostFormInputs } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPostSchema } from 'validators';
import { Avatar } from '../Avatar';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { HiOutlinePhotograph, HiX } from 'react-icons/hi';
import { usePreview } from '../../hooks/usePrieview';

export interface CreatePostFormProps {
  loading?: boolean;
  onSubmit: SubmitHandler<CreatePostFormInputs>;
  form: UseFormReturn<CreatePostFormInputs>;
}

export const useCreatePostForm = (
  props?: Partial<UseFormProps<CreatePostFormInputs>>
) => {
  return useForm<CreatePostFormInputs>({
    ...props,
    resolver: yupResolver(createPostSchema),
  });
};

export const CreatePostForm: FC<CreatePostFormProps> = ({
  form,
  onSubmit,
  loading,
}) => {
  const { data } = useSession<true>({ required: true });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded shadow mb-4">
      <div className="px-8 pt-4 pb-2">
        <div className="flex flex-row mb-2">
          <Avatar user={data?.user} className="mr-2" />
          <div className="flex-grow pt-px">
            <Field
              {...register('text')}
              error={errors.text?.message}
              id="text"
              placeholder="Écrivez quelque-chose"
              type="text"
              required
              fullWidth
              multiline
            />
          </div>
        </div>

        <MediaPreview control={control} />
      </div>

      <div className="px-8 py-2 border-t border-t-gray-200 flex justify-end">
        <FileInput name="media" control={control} mode="append" />

        <button type="submit" className="btn btn-primary btn-sm">
          Envoyer{' '}
          {loading && <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />}
        </button>
      </div>
    </form>
  );
};

const filesFromFileList = (fileList?: FileList | null) =>
  fileList ? Array.from(fileList) : [];
const FileInput: FC<
  {
    mode?: 'update' | 'append';
  } & UseControllerProps<CreatePostFormInputs, 'media'>
> = ({ mode = 'update', children: _, ...control }) => {
  const { field } = useController<CreatePostFormInputs, 'media'>(control);

  const onUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const files = field.value;
      const uploadFiles = filesFromFileList(e.target.files);

      let newFiles: File[];

      switch (mode) {
        case 'update':
          newFiles = uploadFiles;
          break;
        case 'append':
          // Append file
          newFiles = [...uploadFiles, ...(files || [])];

          // Remove duplicate files
          newFiles = newFiles.reduce<File[]>((curr, acc) => {
            // Get similar file in stored array
            const exists = curr.find((f) => {
              return (
                f.name === acc.name &&
                f.lastModified === acc.lastModified &&
                f.size === acc.size &&
                f.type === acc.type
              );
            });

            // If the file is not already stored, add it
            if (!exists) {
              curr.push(acc);
            }

            return curr;
          }, []);
          break;

        default:
          throw new Error('Unknown mode');
      }

      field.onChange(newFiles);
    },
    [field, mode]
  );

  return (
    <label htmlFor="create-post-medias" className="btn btn-white btm-sm mr-4">
      <input
        name={field.name}
        ref={field.ref}
        onBlur={field.onBlur}
        onChange={onUpload}
        id="create-post-medias"
        className="hidden"
        type="file"
        accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
        multiple
      />
      <HiOutlinePhotograph className="h-4 w-4 mr-2 text-green-500" />
      Image / Vidéo
    </label>
  );
};

const MediaPreview: FC<{
  control: Control<CreatePostFormInputs, 'media'>;
}> = ({ control }) => {
  const { field } = useController<CreatePostFormInputs, 'media'>({
    control,
    name: 'media',
  });
  const medias = field.value;
  const previews = usePreview(medias);

  const removeFile = useCallback(
    (index: number) => {
      let newMedia = (medias || []).slice();
      newMedia.splice(index, 1);

      field.onChange(newMedia);
    },
    [field, medias]
  );

  if (!previews || !previews.length) return null;

  return (
    <div className="mt-2">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {previews.map((p, i) => {
          const media = medias?.[p.index];

          return (
            <li
              key={i}
              className="relative group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.preview?.toString()}
                alt={`Prévisualisation du fichier ${media?.name}`}
                className="object-cover pointer-events-none"
              />
              <div className="hidden group-hover:block bg-black/30 absolute inset-0">
                <button
                  type="button"
                  onClick={() => removeFile(p.index)}
                  className="icon-btn absolute top-2 right-2"
                  title="Retirer l'image">
                  <div>
                    <span className="sr-only">{"Retirer l'image"}</span>
                    <HiX />
                  </div>
                </button>
                <p className="text-white text-[.7rem] font-thin absolute bottom-2 left-0 px-2 text-left">
                  {media?.name}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
