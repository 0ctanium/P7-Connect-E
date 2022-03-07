import React, {FC} from 'react'
import {useReactTable} from "../../../hooks/useTable";

export const MobileTablePagination: FC = () => {
    const {
        instance: {
            canNextPage,
            canPreviousPage,
            previousPage,
            nextPage
        },
    } = useReactTable()

    return (
        <div className="flex xl:hidden flex-1 justify-between">
            <button
                className="disabled:bg-gray-50 btn btn-white"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}>
                Précédent
            </button>
            <button
                className="disabled:bg-gray-50 btn btn-white"
                onClick={() => nextPage()}
                disabled={!canNextPage}>
                Suivant
            </button>
        </div>
    )
}
