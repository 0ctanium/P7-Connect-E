import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import React, {Fragment, ReactNode, useCallback, useMemo, useState} from 'react';
import {IconType} from "react-icons";

export interface SwitchFieldProps {
    aria?: string;
    className?: string;
    classes?: {
        switch?: string;
        desc?: string;
        label?: string;
        dot?: string;
        iconOn?: string
        iconOff?: string
    };

    name?: string;
    desc?: string;
    label?: ReactNode;
    labelPos?: 'left' | 'right';
    onIcon?: IconType | ReactNode
    offIcon?: IconType | ReactNode
    short?: boolean;
    hideOutline?: boolean; // hide white outline when short mode is enabled
    value?: boolean;
    defaultValue?: boolean;
    onChange?: (state: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
                                                            label,
                                                            desc,
                                                            onIcon: OnIcon,
                                                            offIcon: OffIcon,
                                                            labelPos= 'left',
                                                            aria,
                                                            className,
                                                            short,
                                                            hideOutline,

                                                            defaultValue,
                                                            value,
                                                            onChange,
                                                            name,

                                                            classes,
                                                        }) => {
    const [state, setState] = useState(defaultValue);
    const checked = useMemo(
        () => (typeof value === 'boolean' ? value : !!state),
        [state, value]
    );

    const handleCheck = useCallback((checked: boolean) => {
        if (onChange) {
            onChange(checked);
        } else {
            setState(checked);
        }
    }, [onChange])

    const text = label || desc ? (
        <span className={clsx('flex-grow flex flex-col', labelPos === 'right' && 'text-right')}>
            {label && <Switch.Label as="span" className={clsx('text-sm font-medium text-gray-900', classes?.label)} passive>{label}</Switch.Label>}
            {desc && <Switch.Description as="span" className={clsx('text-sm text-gray-500', classes?.desc)}>{desc}</Switch.Description>}
        </span>
    ) : null

    const icon = (
        <Fragment>
            {OffIcon && <span
                className={clsx(
                    checked ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity text-gray-400',
                    classes?.iconOff
                )}
                aria-hidden="true"
            >
                {/* @ts-ignore */}
                <OffIcon />
            </span>}

            {OnIcon && <span
                className={clsx(
                    checked ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity text-indigo-600',
                    classes?.iconOn
                )}
                aria-hidden="true"
            >
                {/* @ts-ignore */}
                <OnIcon />
            </span>}
        </Fragment>
    )

    return (
        <Switch.Group as="div" className={'flex items-center justify-between' || className}>
            {labelPos === 'left' && text}
            {aria && <span className="sr-only">{aria}</span>}
            <Switch
                name={name}
                checked={checked}
                onChange={handleCheck}
                className={clsx(
                    !short && (checked ? 'bg-indigo-600' : 'bg-gray-200'),
                    'relative inline-flex flex-shrink-0 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                    short ?
                        'group items-center justify-center h-5 w-10' :
                        'h-6 w-11 border-2 border-transparent transition-colors ease-in-out duration-200',
                    classes?.switch
                )}
            >
                {short ? (
                    <Fragment>
                        {!hideOutline && <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />}
                        <span
                            aria-hidden="true"
                            className={clsx(
                                checked ? 'bg-indigo-600' : 'bg-gray-200',
                                'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
                            )}
                        />
                        <span
                            aria-hidden="true"
                            className={clsx(checked? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
                            )}
                        >{icon}</span>
                    </Fragment>
                ) : (
                    <span
                        aria-hidden="true"
                        className={clsx(
                            checked ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                            classes?.dot
                        )}
                    >{icon}</span>
                )}
            </Switch>

            {labelPos === 'right' && text}
        </Switch.Group>
    )
};
