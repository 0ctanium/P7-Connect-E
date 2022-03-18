import React from 'react';
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
import {TableRow} from "../../TableRow";
import {TablePagination} from "../../pagination";
import {DeleteAction} from "./actions/Delete";
import {useControlledPagination} from "../../../../hooks/useControlledPage";
import {useIndeterminateCheckbox} from "../../../../hooks/useIndeterminateCheckbox";

export type TableData = NonNullable<
    NexusGenFieldTypes["User"]
    >;
export type TableKey = string
export type TableEdit = Partial<Pick<TableData, "role"> & Pick<TableData, "name">>

export interface UserTableProps<D extends Record<string, any>> {
    data: D[];
    fetchData: (options: { pageIndex: number; pageSize: number }) => void;
    loading: boolean;
    count: number;
    error?: ApolloError;
    onUpdate(userId: string, values: TableEdit | null): Promise<any> | any
    onDelete(userIds: string[]): Promise<any> | any
}

export const UserTable: React.FC<UserTableProps<TableData>> = ({
                                                                       data,
                                                                       fetchData,
                                                                       loading,
                                                                       count,
                                                                       error,
                                                                       onUpdate,
                                                                       onDelete
                                                                   }) => {
    const columns = React.useMemo<Column<TableData>[]>(
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
                accessor: (row) => <Actions row={row} />,
                headerClasses: 'relative px-6 py-3',
                cellClasses: ({ classes }) => classes + ' text-right text-sm font-medium',
            },
        ],
        []
    );

    const tableInstance = useTable<TableData>(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
            count,
            fetchData,
            getRowId: (row) => row.id,
            renderActions: <DeleteAction key="delete" onDelete={onDelete} />
        },
        useControlledPagination,
        usePagination,
        useRowSelect,
        useIndeterminateCheckbox,
    );

    return <Table<TableData, TableKey, TableEdit>
        instance={tableInstance}
        loading={loading}
        error={error}
        count={count}
        resolveKey={(row) => row.id}
        onEdit={onUpdate}>
        <TableRow />
        <TablePagination />
    </Table>
};


