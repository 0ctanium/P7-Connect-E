import { Row, TableInstance } from 'react-table';
import React from 'react';

export const Table: React.FC<{
  instance: TableInstance;
  footer: JSX.Element;
}> = ({
  instance: {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    rows,
  },
  footer,
}) => (
  <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
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
              ])}>
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
      {(rows || page).map((row: Row) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell) => {
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
                  ])}>
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
