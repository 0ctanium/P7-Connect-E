import {Row} from 'react-table';
import React, {FC, useMemo} from 'react';
import {useReactTable} from "hooks/useTable";

export const TableRow: FC = () => {
    const {
        instance,
        loading,
        error
    } = useReactTable()

    const {
        data,
        getTableProps,
        headerGroups,
        getTableBodyProps,
        prepareRow,
        page,
        rows,
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
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column, j) => (
                        <th
                            {...column.getHeaderProps([
                                {
                                    className: column.headerClasses
                                        ? column.headerClasses({
                                            classes:
                                                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                        })
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
                        {row.cells.map((cell, j) => {
                            return (
                                <td
                                    {...cell.getCellProps([
                                        {
                                            className: cell.column.cellClasses
                                                ? cell.column.cellClasses({
                                                    classes: 'px-6 py-4 whitespace-nowrap',
                                                })
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
            {state && <tr>{state}</tr>}
            </tbody>
        </table>
    );
}
