import {Row} from 'react-table';
import React, {FC, useMemo} from 'react';
import {useReactTable} from "hooks/useTable";
import {LoadingSpinner} from "../LoadingSpinner";

export const TableRow: FC = () => {
    const {
        instance,
        loading,
        error,
        rowLoading
    } = useReactTable()

    const {
        data,
        getTableProps,
        headerGroups,
        getTableBodyProps,
        prepareRow,
        page,
        rows,
        getRowId
    } = instance

    const state = useMemo(() => {
        if(loading) {
            return (
                <td colSpan={10000} className="py-4 px-6 whitespace-nowrap">
                    Chargement...
                </td>
            )
        }

        if(error) {
            return (
                <td
                    colSpan={10000}
                    className="py-4 px-6 text-red-400 whitespace-nowrap">
                    Erreur...
                </td>
            )
        }

        if(data.length === 0) {
            return (
                <td
                    colSpan={10000}
                    className="py-4 px-6 text-gray-600 whitespace-nowrap">
                    Aucune entrée à afficher...
                </td>
            )
        }

        return null
    }, [data.length, error, loading])

    return (
        <div className="min-w-full overflow-x-auto">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, j) => (
                            <th
                                {...column.getHeaderProps([
                                    {
                                        className: column.headerClasses
                                            ? (typeof column.headerClasses === "string" ? column.headerClasses : column.headerClasses({
                                                classes:
                                                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                            }))
                                            : 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    },
                                ])} key={j}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps([
                    {
                        className: 'bg-white divide-y divide-gray-200',
                    },
                ])}>
                {(rows || page).map((row: Row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={i}>
                            {(getRowId && rowLoading.includes(getRowId(row.original, row.index))) ? (
                                <td colSpan={10000} className="py-4 px-6 whitespace-nowrap">
                                    <LoadingSpinner className="w-6 h-6" />
                                </td>
                            ) : row.cells.map((cell, j) => {
                                return (
                                    <td
                                        {...cell.getCellProps([
                                            {
                                                className: cell.column.cellClasses
                                                    ? (typeof cell.column.cellClasses === "string" ? cell.column.cellClasses : cell.column.cellClasses({
                                                        classes: 'px-6 py-4 whitespace-nowrap',
                                                    }))
                                                    : 'px-6 py-4 whitespace-nowrap',
                                            },
                                        ])} key={j}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                {state && <tr key="state">{state}</tr>}
                </tbody>
            </table>
        </div>
    );
}
