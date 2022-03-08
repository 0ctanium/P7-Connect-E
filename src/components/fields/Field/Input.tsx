import React, { useEffect, useRef, useState } from 'react';
import { InputProps } from '/imports/types';
import { InputBase } from './InputBase';
import clsx from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      trailingIcon: TrailingIcon,
      leadingIcon: LeadingIcon,
      trailing,
      leading,
      className,
      classes,
      children,
      ...inputProps
    },
    ref
  ) => {
    const leadingIconRef = useRef<HTMLDivElement | null>(null);
    const trailingIconRef = useRef<HTMLDivElement | null>(null);
    const [paddingLeft, setLeftPadding] = useState<string | number>('');
    const [paddingRight, setRightPadding] = useState<string | number>('');

    useEffect(() => {
      if (leadingIconRef.current) {
        setLeftPadding(
          leadingIconRef.current ? leadingIconRef.current.offsetWidth + 8 : ''
        );
      }
    }, [leadingIconRef]);

    useEffect(() => {
      if (trailingIconRef.current) {
        setRightPadding(
          trailingIconRef.current ? trailingIconRef.current.offsetWidth + 8 : ''
        );
      }
    }, [trailingIconRef]);

    const inputBaseProps = {
      ...inputProps,
      // @ts-ignore
      ref,
      className: clsx(
        classes?.inputBase,
        // LeadingIcon && 'pl-10',
        // TrailingIcon && 'pr-10',
        leading && 'rounded-l-none',
        trailing && 'rounded-r-none'
      ),
      style: {
        paddingLeft,
        paddingRight,
        ...inputProps.style,
      },
    };

    return (
      <div
        className={clsx(
          'inline-flex relative rounded-md shadow-sm',
          className
        )}>
        {leading &&
          leading({
            className:
              classes?.leading ||
              'z-10 rounded-r-none  btn btn-white focus:border-indigo-500 focus:ring-1 focus:ring-offset-0',
          })}
        <div
          className={
            classes?.inputContainer ||
            clsx(
              'flex relative focus-within:z-20 flex-grow items-stretch',
              leading && '-ml-px',
              trailing && '-mr-px'
            )
          }>
          {LeadingIcon && (
            <div
              ref={leadingIconRef}
              className={
                classes?.leadingIconContainer ||
                'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'
              }>
              {typeof LeadingIcon === 'function' ? (
                <LeadingIcon
                  className={classes?.leadingIcon || 'h-5 w-5 text-gray-400'}
                  aria-hidden="true"
                />
              ) : (
                LeadingIcon
              )}
            </div>
          )}
          {children ? (
            children(inputBaseProps)
          ) : (
            <InputBase {...inputBaseProps} />
          )}
          {TrailingIcon && (
            <div
              ref={trailingIconRef}
              className={
                classes?.trailingIconContainer ||
                'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'
              }>
              {typeof TrailingIcon === 'function' ? (
                <TrailingIcon
                  className={classes?.trailingIcon || 'h-5 w-5 text-gray-400'}
                  aria-hidden="true"
                />
              ) : (
                TrailingIcon
              )}
            </div>
          )}
        </div>
        {trailing &&
          trailing({
            className:
              classes?.trailing ||
              'z-10 rounded-l-none  btn btn-white focus:border-indigo-500 focus:ring-1 focus:ring-offset-0',
          })}
      </div>
    );
  }
);
