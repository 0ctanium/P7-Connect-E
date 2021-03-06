import clsx from 'clsx';
import React from 'react';
import { FieldProps } from 'types/components';
import { Input } from './Input';
import { HiExclamationCircle } from 'react-icons/hi';

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      renderBase,
      desc,
      fullWidth,
      hint,
      label,
      error,
      trailingIcon,
      className,
      ...inputProps
    },
    ref
  ) => {
    const { classes } = inputProps;

    return (
      <div
        className={clsx(
          fullWidth ? 'flex' : 'inline-flex',
          'flex-col mb-5 last:mb-0',
          className
        )}>
        {(label || hint) && (
          <div className="flex justify-between">
            {label && (
              <label
                className={clsx(
                  classes?.label || 'mb-1 text-sm font-medium text-gray-700'
                )}
                htmlFor={inputProps.id}>
                {label}
              </label>
            )}
            {hint && (
              <span className="text-sm text-gray-500" id="email-optional">
                {hint}
              </span>
            )}
          </div>
        )}
        {renderBase ? (
          renderBase
        ) : (
          <Input
            {...inputProps}
            ref={ref}
            className={clsx(
              error &&
                '!text-red-900 !border-red-300 !placeholder-red-300 focus:!ring-red-500 focus:!border-red-500',
              classes?.input
            )}
            trailingIcon={
              error ? (
                <HiExclamationCircle
                  className="w-5 h-5 text-red-300"
                  aria-hidden="true"
                />
              ) : (
                trailingIcon
              )
            }
            aria-invalid={!!error}
            aria-describedby={inputProps.name && `${inputProps.name}-error`}
          />
        )}

        {desc && <p className="mt-2 text-sm text-gray-500">{desc}</p>}

        {error && (
          <p
            id={`${inputProps.name}-error`}
            className={clsx(
              classes?.helperText || 'mt-2 text-sm text-red-600'
            )}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Field.displayName = 'Field';
