import React from 'react';
import {
    Column,
    usePagination,
    useRowSelect,
    useTable,
} from 'react-table';

import { Table } from 'components/table/Table';
import {Actions, NameCell} from "./cells";
import {TableRow} from "../../TableRow";
import {TablePagination} from "../../pagination";
import {DeleteAction} from "./actions/Delete";
import {useIndeterminateCheckbox} from "hooks/useIndeterminateCheckbox";
import {GroupFragment} from "generated/graphql";

export type TableData = GroupFragment
export type TableKey = string

export interface GroupTableProps<D extends Record<string, any>> {
    data: D[];
    onDelete(userIds: string[]): Promise<any> | any
}

export const GroupTable: React.FC<GroupTableProps<TableData>> = ({
                                                                       data,
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
            getRowId: (row) => row.id,
            renderActions: <DeleteAction key="delete" onDelete={onDelete} />
        },
        usePagination,
        useRowSelect,
        useIndeterminateCheckbox
    );

    return (
        <Table<TableData, TableKey> instance={tableInstance}>
            <TableRow />
            <TablePagination />
        </Table>
    )
};


