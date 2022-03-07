import React, {useCallback, useEffect, useState} from 'react';
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
import {Pagination} from "../../pagination";
import {useIndeterminateCheckbox} from "../../Checkbox";
import {TableStateFooter} from "../../StateFooter";

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
    const [editState, setEditState] = useState<Pick<UserTableData, "role"> | null>(null)
    const [userEdit, setUseEdition] = useState<string | null>(null)

    const editUser = useCallback((userId: string) => {
        console.log(userId)
        setUseEdition(userId)
    }, [])
    const cancelEdition = useCallback(() => { setUseEdition(null) }, [])

    const columns = React.useMemo<Column<UserTableData>[]>(
        () => [
            {
                Header: 'Nom',
                accessor: (row) => <NameCell row={row} editing={row.id === userEdit}  />,
            },
            {
                Header: 'Comptes',
                accessor: (row) => <AccountCell row={row} editing={row.id === userEdit} />,
            },
            {
                Header: 'Rôle',
                // @ts-ignore
                cellClasses: ({ classes }) => classes + ' text-sm text-gray-500',
                accessor: (row ) => <RoleCell row={row} editing={row.id === userEdit} onEdit={() => {}} />
            },
            {
                id: 'actions',
                Header: () => <span className="sr-only">Edit</span>,
                accessor: (row) => <Actions row={row} editing={row.id === userEdit} onEdit={editUser} onCancel={cancelEdition} onSubmit={() => {}} />,
                headerClasses: () => 'relative px-6 py-3',
                // @ts-ignore
                cellClasses: ({ classes }) => classes + ' text-right text-sm font-medium',
            },
        ],
        [userEdit, editUser, cancelEdition]
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
            <Table<UserTableData>
                instance={tableInstance}
                footer={<TableStateFooter loading={loading} error={error} data={data} />}
            />

            <Pagination<UserTableData> instance={tableInstance} count={count} />
        </div>
    );
};


