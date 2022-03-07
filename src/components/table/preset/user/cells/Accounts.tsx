import React from 'react'
import {UserTableData} from "../UsersTable";
import {CellComponent} from "../../../../../types";
import {AccountProvider} from "../../../../../constants/provider";
import {Tooltip} from "../../../../Tooltip";
import moment from "moment";

const getTooltipIcon = (provider: AccountProvider): JSX.Element => {
    switch (provider) {
        case AccountProvider.Apple:
            return <p>Apple</p>;

        case AccountProvider.Google:
            // eslint-disable-next-line @next/next/no-img-element
            return <div className="rounded-full bg-white w-6 h-6 p-1"><img src="/icons/social/google.svg" alt="Google" /></div>
        case AccountProvider.Slack:
            // eslint-disable-next-line @next/next/no-img-element
            return <div className="rounded-full bg-white w-6 h-6 p-1"><img src="/icons/social/slack.svg" alt="Slack" /></div>

        case AccountProvider.Facebook:
            // eslint-disable-next-line @next/next/no-img-element
            return <img className="w-6 h-6" src="/icons/social/facebook.svg" alt="Facebook" />
        case AccountProvider.Twitter:
            // eslint-disable-next-line @next/next/no-img-element
            return <img className="w-6 h-6" src="/icons/social/twitter.svg" alt="Twitter" />
        case AccountProvider.LinkedIn:
            // eslint-disable-next-line @next/next/no-img-element
            return <img className="w-6 h-6" src="/icons/social/linkedin.svg" alt="LinkedIn" />
    }
}

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
                    {getTooltipIcon(account.provider as AccountProvider)}
                </Tooltip>
            ))}
        </div>
    </div>
)
