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
import {DeleteAction} from "./actions/Delete";

export type GroupTableData = NonNullable<
    NexusGenFieldTypes["Group"]
    >;
export type GroupTableKey = string
export type GroupTableEdit = Partial<Pick<GroupTableData, "role"> & Pick<GroupTableData, "name">>

export interface GroupTableProps<D extends Record<string, any>> {
    data: D[];
    fetchData: (options: { pageIndex: number; pageSize: number }) => void;
    loading: boolean;
    count: number;
    error?: ApolloError;
    onUpdate(userId: string, values: GroupTableEdit | null): Promise<any> | any
    onDelete(userIds: string[]): Promise<any> | any
}

export const GroupTable: React.FC<GroupTableProps<GroupTableData>> = ({
                                                                       data,
                                                                       fetchData,
                                                                       loading,
                                                                       count,
                                                                       error,
                                                                       onUpdate,
                                                                       onDelete
                                                                   }) => {
    const columns = React.useMemo<Column<GroupTableData>[]>(
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

    const [controlledPageCount, setControlledPageCount] = useState(0);
    const tableInstance = useTable<GroupTableData>(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
            manualPagination: true,
            pageCount: controlledPageCount,
            getRowId: (row) => row.id
        },
        usePagination,
        useRowSelect,
        useIndeterminateCheckbox({
            actions: [
                <DeleteAction key="delete" onDelete={onDelete} />
            ]
        }),
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

    return <Table<GroupTableData, GroupTableKey, GroupTableEdit>
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


