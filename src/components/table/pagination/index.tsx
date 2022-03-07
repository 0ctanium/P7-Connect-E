export * from './Info'
export * from './Desktop'
export * from './Mobile'


import React from 'react'
import {TableInstance} from "react-table";

import {MobileTablePagination} from "./Mobile";
import {TablePaginationInfo} from "./Info";
import {DesktopTablePagination} from "./Desktop";

export interface PaginationProps<
    D extends Record<string, any> = Record<string, unknown>
    > {
    instance: TableInstance<D>;
    count: number
}

export const Pagination = <D extends Record<string, any> = Record<string, unknown>>({
                                                    instance,
                                                    count
                                                }: PaginationProps<D>): JSX.Element => (
    <div className="flex justify-between items-center py-3 px-4 xl:px-6 bg-white border-t border-gray-200">
        <MobileTablePagination<D> instance={instance} />

        <div className="hidden xl:flex xl:flex-1 xl:justify-between xl:items-center">
            <TablePaginationInfo<D> instance={instance} count={count} />
            <DesktopTablePagination<D> instance={instance} />
        </div>
    </div>
)
