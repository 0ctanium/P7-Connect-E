import React, {FC, HTMLProps} from 'react'

export const RadioGroup: FC<{ legend: string }> = ({ legend, children }) => {
    return (
        <fieldset>
            <legend className="text-sm font-medium text-gray-900">{legend}</legend>
            <div className="mt-2 space-y-5">
                {children}
            </div>
        </fieldset>
    )
}

export const Radio: FC<{ label: string, desc?: string} & HTMLProps<HTMLInputElement>> = ({ label, desc, name, id, ...props}) => {
    return (
        <div className="relative flex items-start">
            <div className="absolute flex h-5 items-center">
                <input
                    name={name}
                    aria-describedby={`${id}-description`}
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
