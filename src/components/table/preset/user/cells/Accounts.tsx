import React from 'react'
import {UserTableData} from "../UsersTable";
import moment from "moment";
import {Tooltip} from "../../../../Tooltip";
import {CellComponent} from "../../../../../types";

export const AccountCell: CellComponent<UserTableData> = ({ row }) => (
    <div className="flex items-center">
        <div className="ml-4">
            {row.accounts.map((account, i) => (
                <Tooltip
                    key={i}
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
