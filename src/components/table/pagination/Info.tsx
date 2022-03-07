import React from 'react'
import {TableInstance} from "react-table";

export interface TablePaginationInfoProps<
    D extends Record<string, any> = Record<string, unknown>
    > {
    instance: TableInstance<D>;
    count: number
}

export type TablePaginationInfoComponent = <
    D extends Record<string, any> = Record<string, unknown>
    >(
    props: TablePaginationInfoProps<D>
) => JSX.Element;

export const TablePaginationInfo: TablePaginationInfoComponent = ({
                                                                 instance: {
                                                                     state: { pageIndex, pageSize },
                                                                 },
                                                                 count
                                                             }) => (
    <p className="text-sm text-gray-700">
        Affichage des entrées {' '}
        <span className="font-medium">{pageIndex * pageSize}</span> à{' '}
        <span className="font-medium">
            {Math.min((pageIndex + 1) * pageSize, count)}
        </span>{' '}
        sur <span className="font-medium">{count}</span>
    </p>
)
