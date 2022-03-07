export * from './Info'
export * from './Desktop'
export * from './Mobile'

import React, {FC} from 'react'

import {MobileTablePagination} from "./Mobile";
import {TablePaginationInfo} from "./Info";
import {DesktopTablePagination} from "./Desktop";

export const TablePagination: FC = () => (
    <div className="flex justify-between items-center py-3 px-4 xl:px-6 bg-white border-t border-gray-200">
        <MobileTablePagination />

        <div className="hidden xl:flex xl:flex-1 xl:justify-between xl:items-center">
            <TablePaginationInfo />
            <DesktopTablePagination />
        </div>
    </div>
)
