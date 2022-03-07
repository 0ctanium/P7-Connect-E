import React, {FC} from 'react'
import {useReactTable} from "../../../hooks/useTable";

export const TablePaginationInfo: FC = () => {
    const {
        instance: {
            state: { pageIndex, pageSize },
        },
        count
    } = useReactTable()

    return (
        <p className="text-sm text-gray-700">
            Affichage des entrées {' '}
            <span className="font-medium">{pageIndex * pageSize}</span> à{' '}
            <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, count)}
            </span>{' '}
            sur <span className="font-medium">{count}</span>
        </p>
    )
}
