import {ElementType, FC, Fragment, PropsWithChildren, useMemo, useState} from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { HiCheck as CheckIcon, HiSelector as SelectorIcon } from 'react-icons/hi'
import clsx from "clsx";
import {Roles} from "constants/roles";

interface SelectionProps<T extends string | number | symbol = any> {
    selected: T,
    options: { value: T, el: string | JSX.Element }[]
    label?: string
    onChange(value: T): void
}

export const Selection = <T extends string | number | symbol>({ label, selected, options, onChange }: PropsWithChildren<SelectionProps<T>>): JSX.Element => {
    const selectedEl = useMemo(() => options.find(o => o.value === selected)?.el, [options, selected])

    return (
        <Listbox<ElementType, T> value={selected} onChange={onChange}>
            {({ open }) => (
                <>
                    {label && <Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>}
                    <div className="mt-1 relative">
                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <span className="block truncate">{selectedEl}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {options.map(({ value, el}, i) => (
                                    <Listbox.Option
                                        key={i}
                                        className={({ active }) =>
                                            clsx(
                                                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                'cursor-default select-none relative py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={value}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                            <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                {el}
                                            </span>

                                                {selected ? (
                                                    <span
                                                        className={clsx(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
