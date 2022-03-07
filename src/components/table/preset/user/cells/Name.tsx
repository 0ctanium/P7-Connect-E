import React, {FC} from 'react'
import {UserTableData} from "../UsersTable";
import {Tooltip} from "../../../../Tooltip";
import {GoVerified} from "react-icons/go";

export const NameCell: FC<{ row: UserTableData, editing: boolean }> = ({ row }) => (
    <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className="w-10 h-10 rounded-full"
                src={row.image || ''}
                alt=""
            />
        </div>
        <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
                {row.name}
            </div>
            <div className="flex flex-row items-center text-sm text-gray-500">
                {row.emailVerified && (
                    <Tooltip render={<p className="text-sm font-bold text-white"> Email confirmé</p>}>

                        <GoVerified
                            className="mr-1.5 w-4 h-4 text-gray-400"
                            aria-hidden="true"
                        />
                    </Tooltip>
                )}
                {row.email}
            </div>
        </div>
    </div>
)
