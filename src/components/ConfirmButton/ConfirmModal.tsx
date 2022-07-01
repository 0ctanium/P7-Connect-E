import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineExclamation } from 'react-icons/hi';
import clsx from 'clsx';
import { ConfirmModalProps } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onClose,
  open,
  onConfirm,
  onDismiss,
  dialogTitle = 'Confirmer cette action',
  dialogDesc,
  confirmLabel = 'Confirmer',
  dismissLabel = 'Annuler',
  hideIcon,
  icon: Icon = HiOutlineExclamation,
  loading,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="overflow-y-auto fixed inset-0 z-40"
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
            <Dialog.Panel className="inline-block overflow-hidden sm:my-8 sm:w-full sm:max-w-lg text-left align-bottom sm:align-middle bg-white rounded-lg shadow-xl transition-all transform">
              <div className="sm:p-6 px-4 pt-5 pb-4 sm:pb-4 bg-white">
                <div className="sm:flex sm:items-start">
                  {!hideIcon && (
                    <div className="flex flex-shrink-0 justify-center items-center mx-auto sm:mx-0 w-12 sm:w-10 h-12 sm:h-10 bg-red-100 rounded-full">
                      <Icon
                        className="w-6 h-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div
                    className={clsx(
                      'mt-3 sm:mt-0 text-center',
                      !hideIcon && 'sm:ml-4',
                      'sm:text-left'
                    )}>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900">
                      {dialogTitle}
                    </Dialog.Title>
                    {dialogDesc && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{dialogDesc}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:flex sm:flex-row-reverse py-3 px-4 sm:px-6 bg-gray-50">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 sm:ml-3 w-full sm:w-auto text-base sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm focus:outline-none"
                  onClick={onConfirm}>
                  {confirmLabel}
                  {loading && (
                    <LoadingSpinner className="ml-3 h-4 w-4 text-gray-200" />
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto text-base sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-fiord-500 focus:ring-offset-2 shadow-sm focus:outline-none"
                  onClick={onDismiss}
                  ref={cancelButtonRef}>
                  {dismissLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
