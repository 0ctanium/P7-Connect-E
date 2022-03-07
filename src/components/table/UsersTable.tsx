import React, { HTMLAttributes, useEffect, useState } from 'react';
import {
    Column,
    Hooks,
    usePagination,
    useRowSelect,
    useTable,
} from 'react-table';
import Link from 'next/link';


import { GoVerified } from 'react-icons/go';
// import { FcGoogle } from 'react-icons/fc';
// import { FaGithub } from 'react-icons/fa';

import { Tooltip } from 'components/Tooltip';
import { Table } from 'components/table/Table';
import { TablePagination } from 'components/table/TablePagination';

import {NexusGenFieldTypes} from "../../../generated/nexus-typegen";
import {ApolloError} from "@apollo/client";
import {Roles} from "../../constants";
import moment from "moment";

export type UserTableData = NonNullable<
    NexusGenFieldTypes["User"]
    >;
export interface UserTableProps<D extends Record<string, any>> {
    data: D[];
    fetchData: (options: { pageIndex: number; pageSize: number }) => void;
    loading: boolean;
    count: number;
    error?: ApolloError;
}

export const UserTable: React.FC<UserTableProps<UserTableData>> = ({
                                                                       data,
                                                                       fetchData,
                                                                       loading,
                                                                       count,
                                                                       error,
                                                                   }) => {
    const columns = React.useMemo<Column<UserTableData>[]>(
        () => [
            {
                Header: 'Nom',
                accessor: (row) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={row.image || ''}
                                alt=""
                            />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {row.name}
                            </div>
                            <div className="flex flex-row items-center text-sm text-gray-500">
                                {row.emailVerified && (
                                    <Tooltip render={<p className="text-sm font-bold text-white"> Email confirmé</p>}>

                                            <GoVerified
                                                className="mr-1.5 w-4 h-4 text-gray-400"
                                                aria-hidden="true"
                                            />
                                    </Tooltip>
                                )}
                                {row.email}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                Header: 'Comptes',
                accessor: (row) => (
                    <div className="flex items-center">
                        <div className="ml-4">
                            {row.accounts.map(account => (
                                <Tooltip
                                    key={account.id}
                                    render={
                                        <p className="text-sm font-bold text-white">
                                            Depuis {moment(account.createdAt).calendar().toLocaleLowerCase()}
                                        </p>
                                    }>
                                    {account.provider}
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                ),
            },
            {
                Header: 'Rôle',
                // @ts-ignore
                cellClasses: ({ classes }) => classes + ' text-sm text-gray-500',
                accessor: ({ role }) => {
                    switch (role) {
                        case Roles.ADMIN:
                            return "Administrateur"
                        case Roles.MODERATOR:
                            return "Modérateur"
                        case Roles.USER:
                            return "Membre"
                        default:
                            return "Inconnu"
                    }
                }
            },
            {
                id: 'actions',
                Header: () => <span className="sr-only">Edit</span>,
                accessor: (row) =>
                    <Link href={`/admin/users/${row.id}`}>
                        <a className="text-indigo-600 hover:text-indigo-900">
                            Editer
                        </a>
                    </Link>
                ,
                headerClasses: () => 'relative px-6 py-3',
                // @ts-ignore
                cellClasses: ({ classes }) => classes + ' text-right text-sm font-medium',
            },
        ],
        []
    );
    const [controlledPageCount, setControlledPageCount] = useState(0);
    const tableInstance = useTable<UserTableData>(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
            manualPagination: true,
            pageCount: controlledPageCount,
        },
        usePagination,
        useRowSelect,
        (hooks: Hooks<UserTableData>) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    headerClasses: () => 'px-6 py-3 leading-[0] w-0',
                    // @ts-ignore
                    Header: ({ getToggleAllPageRowsSelectedProps }) =>  <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />,
                    // @ts-ignore
                    Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                },
                ...columns,
            ]);
        }
    );

    const {
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        state: { pageIndex, pageSize },
    } = tableInstance;

    useEffect(() => {
        setControlledPageCount(Math.ceil(count / pageSize));
    }, [count, pageSize]);

    useEffect(() => {
        fetchData({ pageIndex, pageSize });
    }, [fetchData, pageIndex, pageSize]);

    return (
        <div className="overflow-hidden sm:rounded-lg shadow">
            <Table
                // @ts-ignore
                instance={tableInstance}
                footer={
                    <tr>
                        {loading ? (
                            <td colSpan={10000} className="py-4 px-6 whitespace-nowrap">
                                Chargement...
                            </td>
                        ) : (
                            error && (
                                <td
                                    colSpan={10000}
                                    className="py-4 px-6 text-red-400 whitespace-nowrap">
                                    Erreur...
                                </td>
                            )
                        )}
                    </tr>
                }
            />

            <div className="flex justify-between items-center py-3 px-4 xl:px-6 bg-white border-t border-gray-200">
                <div className="flex xl:hidden flex-1 justify-between">
                    <button
                        className="disabled:bg-gray-50 btn btn-white"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <button
                        className="disabled:bg-gray-50 btn btn-white"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}>
                        Next
                    </button>
                </div>

                <div className="hidden xl:flex xl:flex-1 xl:justify-between xl:items-center">
                    <div>
                        <p className="text-sm text-gray-700">
                            Affichage des entrées {' '}
                            <span className="font-medium">{pageIndex * pageSize}</span> à{' '}
                            <span className="font-medium">
                                {Math.min((pageIndex + 1) * pageSize, count)}
                            </span>{' '}
                            sur <span className="font-medium">{count}</span>
                        </p>
                    </div>

                    <TablePagination<UserTableData> instance={tableInstance} />
                </div>
            </div>
        </div>
    );
};

const IndeterminateCheckbox = React.forwardRef<
    HTMLInputElement,
    {
        indeterminate: any;
    } & HTMLAttributes<HTMLInputElement>
    >(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
        // @ts-ignore
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input
                type="checkbox"
                className="form-checkbox"
                // @ts-ignore
                ref={resolvedRef}
                {...rest}
            />
        </>
    );
});
