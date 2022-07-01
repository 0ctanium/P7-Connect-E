import {
  Component,
  FC,
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineX as XIcon } from 'react-icons/hi';
import clsx from 'clsx';

export const SlideOverTitle: FC<{
  onClose(state: boolean): void;
  title: string;
  desc?: string;
}> = ({ onClose, title, desc }) => {
  return (
    <div className="bg-scarlet-700 py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Dialog.Title className="text-lg font-medium text-white">
          {' '}
          {title}{' '}
        </Dialog.Title>
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="rounded-md bg-scarlet-700 text-scarlet-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => onClose(false)}>
            <span className="sr-only">Fermer le panneau</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-1">
        <p className="text-sm text-scarlet-300">{desc}</p>
      </div>
    </div>
  );
};

export const SlideOverBody = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  children,
  ...props
}: PropsWithChildren<
  HTMLAttributes<Tag> & { as?: ReactNode }
>): JSX.Element => {
  return (
    // @ts-ignore
    <Component
      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
      {...props}>
      {children}
    </Component>
  );
};

export const SlideOverContainer = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  children,
  ...props
}: PropsWithChildren<
  { as?: ReactNode } & HTMLAttributes<Tag>
>): JSX.Element => {
  return (
    // @ts-ignore
    <Component className="h-0 flex-1 overflow-y-auto" {...props}>
      {children}
    </Component>
  );
};

export const SlideOverContent = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  children,
  ...props
}: PropsWithChildren<
  { as?: ReactNode } & HTMLAttributes<Tag>
>): JSX.Element => {
  return (
    // @ts-ignore
    <Component className="flex flex-1 flex-col justify-between" {...props}>
      {children}
    </Component>
  );
};

export const SlideOverSection = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  children,
  ...props
}: PropsWithChildren<
  { as?: ReactNode } & HTMLAttributes<Tag>
>): JSX.Element => {
  return (
    // @ts-ignore
    <Component className="divide-y divide-gray-200 px-4 sm:px-6" {...props}>
      {children}
    </Component>
  );
};

export const SlideOverFooter = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  children,
  ...props
}: PropsWithChildren<
  { as?: ReactNode } & HTMLAttributes<Tag>
>): JSX.Element => {
  return (
    // @ts-ignore
    <Component className="flex flex-shrink-0 justify-end px-4 py-4" {...props}>
      {children}
    </Component>
  );
};

export const SlideOver: FC<{
  open?: boolean;
  onClose(state: boolean): void;
  className?: string;
}> = ({ children, open, onClose, className }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="z-30 fixed inset-0 overflow-hidden"
        onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full">
              <div className={clsx('pointer-events-auto w-screen', className)}>
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
