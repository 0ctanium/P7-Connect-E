import React, {FC} from 'react'
import {AdminLayoutSection} from "./layout/Admin";

export const Section: FC<{ title?: string, desc?: string }> = ({ children, title, desc }) => {
    return (
        <AdminLayoutSection>
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{desc}</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        {children}
                    </div>
                </div>
            </div>
        </AdminLayoutSection>
    )
}
