import React, {useEffect, useState} from 'react';
import {
    Column,
    usePagination,
    useRowSelect,
    useTable,
} from 'react-table';

import { Table } from 'components/table/Table';

import {NexusGenFieldTypes} from "../../../../../generated/nexus-typegen";

import {ApolloError} from "@apollo/client";
import {AccountCell, Actions, NameCell, RoleCell} from "./cells";
import {useIndeterminateCheckbox} from "../../Checkbox";
import {TableRow} from "../../TableRow";
import {TablePagination} from "../../pagination";

export type UserTableData = NonNullable<
    NexusGenFieldTypes["User"]
    >;
export type UserTableKey = string
export type UserTableEdit = Pick<UserTableData, "role"> & Pick<UserTableData, "name">

export interface UserTableProps<D extends Record<string, any>> {
    data: D[];
    fetchData: (options: { pageIndex: number; pageSize: number }) => void;
    loading: boolean;
    count: number;
    error?: ApolloError;
    onUpdate(userId: string, values: UserTableEdit | null): Promise<void> | void
}

export const UserTable: React.FC<UserTableProps<UserTableData>> = ({
                                                                       data,
                                                                       fetchData,
                                                                       loading,
                                                                       count,
                                                                       error,
                                                                       onUpdate
                                                                   }) => {
    const columns = React.useMemo<Column<UserTableData>[]>(
        () => [
            {
                Header: 'Nom',
                accessor: (row) => <NameCell row={row}  />,
            },
            {
                Header: 'Comptes',
                accessor: (row) => <AccountCell row={row} />,
            },
            {
                Header: 'Rôle',
                cellClasses: ({ classes }) => classes + ' text-sm text-gray-500',
                accessor: (row ) => <RoleCell row={row} />
            },
            {
                id: 'actions',
                Header: () => <span className="sr-only">Edit</span>,
                accessor: (row) => <Actions row={row} onDelete={() => console.log("deleting")} />,
                headerClasses: () => 'relative px-6 py-3',
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
        useIndeterminateCheckbox,
    );

    const {
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
            <Table<UserTableData, UserTableKey, UserTableEdit>
                instance={tableInstance}
                loading={loading}
                error={error}
                count={count}
                resolveKey={(row) => row.id}
                onEdit={onUpdate}>
                <TableRow />
                <TablePagination />
            </Table>
        </div>
    );
};


