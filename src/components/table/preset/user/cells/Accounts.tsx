import React from 'react'
import {TableData} from "../UsersTable";
import {CellComponent} from "types";
import {Tooltip} from "components/Tooltip";
import moment from "moment";
import {SocialIcon} from "icons/Social";
import {BuiltInProviderType} from "next-auth/providers";

export const AccountCell: CellComponent<TableData> = ({ row }) => (
    <div className="flex items-center">
        <div className="ml-4 flex gap-2">
            {row.accounts.map((account, i) => (
                <Tooltip
                    key={i}
                    className="tooltip-bg-gray-900/80 text-xs font-light text-white"
                    render={moment(account?.createdAt).format("[depuis le] dddd D MMMM YYYY [à] LT")}>
                    <SocialIcon className="w-6 h-6" provider={account?.provider as BuiltInProviderType} circled />
                </Tooltip>
            ))}
        </div>
    </div>
)
