import React, {FC} from 'react'
import {UserTableData} from "../UsersTable";
import moment from "moment";
import {Tooltip} from "../../../../Tooltip";

export const AccountCell: FC<{ row: UserTableData, editing: boolean }> = ({ row }) => (
    <div className="flex items-center">
        <div className="ml-4">
            {row.accounts.map(account => (
                <Tooltip
                    key={account.id}
                    render={
                        <p className="text-sm font-bold text-white">
                            Depuis {moment(account.createdAt).calendar().toLocaleLowerCase()}
                        </p>
                    }>
                    {account.provider}
                </Tooltip>
            ))}
        </div>
    </div>
)
