import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Field } from '../fields/Field';
import {
  Control,
  Controller,
  SubmitHandler,
  useController,
  UseControllerProps,
  useForm,
  UseFormProps,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { CreatePostFormInputs } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPostSchema } from 'validators';
import { Avatar } from '../Avatar';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';

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

  const handleUploadFile = useCallback(() => {});

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded shadow mb-4">
      <div className="px-8 py-4 flex flex-row">
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
      <div className="px-8 py-2 border-t border-t-gray-200 flex justify-end">
        <FileInput name="media" control={control} mode="append" />

        <button type="submit" className="btn btn-primary btn-sm">
          Envoyer{' '}
          {loading && <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />}
        </button>
      </div>

      <MediaPreview control={control} />
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
          newFiles = [...(files || []), ...uploadFiles];

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

type Preview = string | ArrayBuffer | null;
const MediaPreview: FC<{
  control: Control<CreatePostFormInputs, 'media'>;
}> = ({ control }) => {
  const medias = useWatch<CreatePostFormInputs, 'media'>({
    control,
    name: 'media',
  });

  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const previews: Preview[] = [],
      fileReaders: FileReader[] = [];
    let isCancel = false;
    if (medias && medias.length) {
      Array.from(medias).forEach((file) => {
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        fileReader.onload = (e) => {
          const { result } = e.target!;
          if (result) {
            previews.push(result);
          }
          if (previews.length === medias.length && !isCancel) {
            setPreviews(previews);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [medias]);

  console.log(medias, previews);

  return (
    <div>
      {previews.map((p, i) => (
        <img src={p!.toString()} alt="" key={i} />
      ))}
    </div>
  );
};
