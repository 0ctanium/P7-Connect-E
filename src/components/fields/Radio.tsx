import React, { FC, HTMLProps } from 'react';

export const RadioGroup: FC<{ legend: string }> = ({ legend, children }) => {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-gray-900">{legend}</legend>
      <div className="mt-2 space-y-5">{children}</div>
    </fieldset>
  );
};

type RadioProps = {
  label: string;
  desc?: string;
} & HTMLProps<HTMLInputElement>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, desc, name, id, ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="absolute flex h-5 items-center">
          <input
            name={name}
            aria-describedby={`${id}-description`}
            type="radio"
            className="h-4 w-4 border-gray-300 text-fiord-600 focus:ring-fiord-500"
            ref={ref}
            {...props}
          />
        </div>
        <div className="pl-7 text-sm">
          <label htmlFor={id} className="font-medium text-gray-900">
            {' '}
            {label + ' '}
          </label>
          {desc && (
            <p id={`${id}-description`} className="text-gray-500">
              {desc}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Radio.displayName = 'Radio';
