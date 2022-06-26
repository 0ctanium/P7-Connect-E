import { Field } from '../fields/Field';
import {
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { EditPostFormInputs } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import { editPostSchema } from 'validators';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../LoadingSpinner';
import React, { Fragment, useRef, FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface EditPostFormProps {
  loading?: boolean;
  open: boolean;
  onClose(state: boolean): any;
  onSubmit: SubmitHandler<EditPostFormInputs>;
  form: UseFormReturn<EditPostFormInputs>;
}

export const useEditPostForm = (
  props?: Partial<UseFormProps<EditPostFormInputs>>
) => {
  return useForm<EditPostFormInputs>({
    ...props,
    resolver: yupResolver(editPostSchema),
  });
};

export const EditPostForm: FC<EditPostFormProps> = ({
  form,
  onSubmit,
  loading,
  open,
  onClose,
}) => {
  const { data } = useSession<true>({ required: true });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const cancelButtonRef = useRef(null);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="overflow-y-hidden max-h-screen fixed inset-0 z-30"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={onClose}>
        <div className="flex sm:block justify-center items-end sm:p-0 px-4 pt-4 pb-20 min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <Dialog.Panel
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              className="inline-block overflow-hidden sm:my-8 w-full sm:max-w-lg text-left align-bottom sm:align-middle bg-white rounded-lg shadow-xl transition-all transform">
              <div className="sm:p-6 px-4 pt-5 pb-4 sm:pb-4 bg-white">
                <div className="sm:flex sm:items-start">
                  <div className="mb-3 sm:mt-0 text-center sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900">
                      Modifier la publication
                    </Dialog.Title>
                  </div>
                </div>
                <div className="flex w-full h-full relative">
                  <Field
                    {...register('text')}
                    error={errors.text?.message}
                    id="text"
                    className="flex-1 inset-0 overflow-y-auto"
                    placeholder="Écrivez quelque-chose"
                    type="text"
                    required
                    minRows={6}
                    classes={{
                      inputBase: 'resize-none',
                    }}
                    fullWidth
                    multiline
                  />
                </div>
              </div>
              <div className="sm:flex sm:flex-row-reverse py-3 px-4 sm:px-6 bg-gray-50">
                <button
                  type="submit"
                  disabled={!isDirty}
                  className="btn btn-full btn-primary sm:ml-3">
                  Modifier
                  {loading && (
                    <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-full btn-white mt-3 sm:mt-0 sm:ml-3"
                  onClick={() => onClose(false)}
                  ref={cancelButtonRef}>
                  Annuler
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
