import { Disclosure } from '@headlessui/react'
import React, {FC} from 'react'
import {HiChevronUp as ChevronUpIcon} from 'react-icons/hi'

export const FormDisclosure: FC<{label: string}> = ({ label, children }) => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="group flex py-2 text-sm font-medium text-left text-indigo-600 hover:text-indigo-500">
                        <ChevronUpIcon
                            className={`${
                                open ? 'transform rotate-180' : ''
                            } w-5 h-5 text-indigo-600 group-hover:text-indigo-500`}
                        />
                        <span>{label}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-6 px-4 pt-3 pb-2 text-sm text-gray-500">
                        {children}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
