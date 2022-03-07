import { Row, TableInstance } from 'react-table';
import React from 'react';

export interface TableProps<
    D extends Record<string, any> = Record<string, unknown>
    > {
  instance: TableInstance<D>;
  footer?: JSX.Element;
}

export const Table = <D extends object = {}>({
  instance: {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    rows,
  },
  footer,
}: TableProps<D>): JSX.Element => (
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
    <tbody
      {...getTableBodyProps([
        {
          className: 'bg-white divide-y divide-gray-200',
        },
      ])}>
      {(rows || page).map((row: Row<D>, i) => {
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
      {footer}
    </tbody>
  </table>
);
