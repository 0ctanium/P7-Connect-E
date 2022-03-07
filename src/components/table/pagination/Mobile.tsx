import React from 'react'
import {TableInstance} from "react-table";

export interface MobileTablePaginationProps<
    D extends Record<string, any> = Record<string, unknown>
    > {
    instance: TableInstance<D>;
}

export type MobileTablePaginationComponent = <
    D extends Record<string, any> = Record<string, unknown>
    >(
    props: MobileTablePaginationProps<D>
) => JSX.Element;

export const MobileTablePagination: MobileTablePaginationComponent = ({
                                                                 instance: {
                                                                     canNextPage,
                                                                     canPreviousPage,
                                                                     previousPage,
                                                                     nextPage
                                                                 },
                                                             }) => (
    <div className="flex xl:hidden flex-1 justify-between">
        <button
            className="disabled:bg-gray-50 btn btn-white"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}>
            Précédent
        </button>
        <button
            className="disabled:bg-gray-50 btn btn-white"
            onClick={() => nextPage()}
            disabled={!canNextPage}>
            Suivant
        </button>
    </div>
)
