import React, { HTMLAttributes } from 'react';
import { TableInstance } from 'react-table';
import {
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiChevronLeft,
    HiChevronRight,
} from 'react-icons/hi';
import clsx from 'clsx';

export interface DesktopTablePaginationProps<
    D extends Record<string, any> = Record<string, unknown>
    > {
    instance: TableInstance<D>;
}

export type DesktopTablePaginationComponent = <
    D extends Record<string, any> = Record<string, unknown>
    >(
    props: DesktopTablePaginationProps<D>
) => JSX.Element;

export const DesktopTablePagination: DesktopTablePaginationComponent = ({
                                                              instance: {
                                                                  canNextPage,
                                                                  canPreviousPage,
                                                                  gotoPage,
                                                                  previousPage,
                                                                  nextPage,
                                                                  pageCount,
                                                                  setPageSize,
                                                                  state: { pageIndex, pageSize },
                                                              },
                                                          }) => {
    return (
        <div className="flex items-center">
            <nav
                className="inline-flex overflow-hidden relative z-0 rounded-md border border-gray-300 divide-x divide-gray-300 shadow-sm"
                aria-label="Pagination">
                {pageCount > 5 && (
                    <PaginationButton
                        className="px-2"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}>
                        <span className="sr-only">Aller à la première page</span>
                        <HiChevronDoubleLeft className="w-5 h-5" aria-hidden="true" />
                    </PaginationButton>
                )}
                <PaginationButton
                    className="px-2"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}>
                    <span className="sr-only">Aller à la page précédente</span>
                    <HiChevronLeft className="w-5 h-5" aria-hidden="true" />
                </PaginationButton>

                {pageIndex > 2 && (
                    <span className="inline-flex relative items-center py-2 px-4 text-sm font-medium text-gray-700 bg-white">
                        ...
                    </span>
                )}

                {pageIndex >= pageCount - 1 && pageIndex - 3 > 0 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex - 4)}>
                        {pageIndex - 3}
                    </PaginationButton>
                )}
                {pageIndex >= pageCount - 2 && pageIndex - 2 > 0 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex - 3)}>
                        {pageIndex - 2}
                    </PaginationButton>
                )}

                {pageIndex > 1 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex - 2)}>
                        {pageIndex - 1}
                    </PaginationButton>
                )}
                {pageIndex > 0 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex - 1)}>
                        {pageIndex}
                    </PaginationButton>
                )}

                <span className="inline-flex relative items-center py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100">
                    {pageIndex + 1}
                </span>

                {pageIndex < pageCount - 1 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex + 1)}>
                        {pageIndex + 2}
                    </PaginationButton>
                )}
                {pageIndex < pageCount - 2 && (
                    <PaginationButton onClick={() => gotoPage(pageIndex + 2)}>
                        {pageIndex + 3}
                    </PaginationButton>
                )}

                {pageIndex <= 1 && pageIndex + 4 < pageCount && (
                    <PaginationButton onClick={() => gotoPage(pageIndex + 3)}>
                        {pageIndex + 4}
                    </PaginationButton>
                )}
                {pageIndex <= 0 && pageIndex + 5 < pageCount && (
                    <PaginationButton onClick={() => gotoPage(pageIndex + 4)}>
                        {pageIndex + 5}
                    </PaginationButton>
                )}

                {pageIndex < pageCount - 3 && (
                    <span className="inline-flex relative items-center py-2 px-4 text-sm font-medium text-gray-700 bg-white">
                        ...
                    </span>
                )}

                <PaginationButton
                    className="px-2"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}>
                    <span className="sr-only">Aller à la page suivante</span>
                    <HiChevronRight className="w-5 h-5" aria-hidden="true" />
                </PaginationButton>
                {pageCount > 5 && (
                    <PaginationButton
                        className="px-2"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}>
                        <span className="sr-only">Aller à la dernière page</span>
                        <HiChevronDoubleRight className="w-5 h-5" aria-hidden="true" />
                    </PaginationButton>
                )}
            </nav>
            <select
                className="ml-6 focus:ring-0 btn-select btn btn-white"
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                }}>
                {[1, 2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        Afficher {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
};

const PaginationButton: React.FC<
    HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
    > = ({ children, className, ...props }) => {
    return (
        <button
            {...props}
            className={clsx(
                'inline-flex relative items-center py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none',
                className
            )}>
            {children}
        </button>
    );
};
