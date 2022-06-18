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
                    render={
                        <p className="text-sm font-bold text-white">
                            Depuis {moment(account?.createdAt).calendar().toLocaleLowerCase()}
                        </p>
                    }>
                    <SocialIcon className="w-6 h-6" provider={account?.provider as BuiltInProviderType} circled />
                </Tooltip>
            ))}
        </div>
    </div>
)
