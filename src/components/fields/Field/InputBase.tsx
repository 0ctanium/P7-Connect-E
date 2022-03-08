import React from 'react';
import { InputBaseProps } from '/imports/types';
import TextareaAutosize from 'react-textarea-autosize';
import clsx from 'clsx';

export const InputBase = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputBaseProps
  // @ts-ignore
>(({ className, multiline, minRows = 1, maxRows, ...props }, ref) =>
  multiline ? (
    <TextareaAutosize
      {...props}
      className={clsx(
        'block w-full sm:text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 form-input',
        className
      )}
      minRows={minRows}
      maxRows={maxRows}
      // @ts-ignore
      ref={ref}
    />
  ) : (
    <input
      {...props}
      className={clsx(
        'block w-full sm:text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 form-input',
        className
      )}
      // @ts-ignore
      ref={ref}
    />
  )
);
