import React from 'react'
import { TableData} from "../GroupsTable";
import {CellComponent} from "types";
import Link from 'next/link';

export const Actions: CellComponent<TableData> = ({ row }) => {
    return (
        <div>
            <Link href={`/admin/groups/${row.id}/edit`}>
                <a className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Éditer
                </a>
            </Link>
        </div>
    )
}
