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
import {Actions, NameCell} from "./cells";
import {TableRow} from "../../TableRow";
import {TablePagination} from "../../pagination";
import {DeleteAction} from "./actions/Delete";
import {useControlledPagination} from "../../../../hooks/useControlledPage";
import {useIndeterminateCheckbox} from "../../../../hooks/useIndeterminateCheckbox";

export type TableData = NonNullable<
    NexusGenFieldTypes["Group"]
    >;
export type TableKey = string

export interface GroupTableProps<D extends Record<string, any>> {
    data: D[];
    fetchData: (options: { pageIndex: number; pageSize: number }) => void;
    loading: boolean;
    count: number;
    error?: ApolloError;
    onDelete(userIds: string[]): Promise<any> | any
}

export const GroupTable: React.FC<GroupTableProps<TableData>> = ({
                                                                       data,
                                                                       fetchData,
                                                                       loading,
                                                                       count,
                                                                       error,
                                                                       onDelete
                                                                   }) => {
    const columns = React.useMemo<Column<TableData>[]>(
        () => [
            {
                Header: 'Nom',
                accessor: (row) => <NameCell row={row}  />,
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
            fetchData,
            count,
            getRowId: (row) => row.id,
            renderActions: <DeleteAction key="delete" onDelete={onDelete} />
        },
        useControlledPagination,
        usePagination,
        useRowSelect,
        useIndeterminateCheckbox
    );

    return <Table<TableData, TableKey>
        instance={tableInstance}
        loading={loading}
        error={error}
        count={count}>
        <TableRow />
        <TablePagination />
    </Table>
};


