import React from 'react'
import {UserTableData} from "../UsersTable";
import {CellComponent} from "../../../../../types";
import {AccountProvider} from "../../../../../constants/provider";
import {Tooltip} from "../../../../Tooltip";
import moment from "moment";
import {SocialIcon} from "../../../../../icons/Social";

export const AccountCell: CellComponent<UserTableData> = ({ row }) => (
    <div className="flex items-center">
        <div className="ml-4 flex gap-2">
            {row.accounts.map((account, i) => (
                <Tooltip
                    key={i}
                    render={
                        <p className="text-sm font-bold text-white">
                            Depuis {moment(account.createdAt).calendar().toLocaleLowerCase()}
                        </p>
                    }>
                    <SocialIcon className="w-6 h-6" provider={account.provider as AccountProvider} circled />
                </Tooltip>
            ))}
        </div>
    </div>
)
