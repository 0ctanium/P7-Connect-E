import React, {FC} from 'react'
import {User} from "generated/graphql";
import clsx from "clsx";
import {Tooltip} from "./Tooltip";
import {RoleBadge} from "./RoleBadge";

interface AvatarProps {
    user?: Partial<User> | null;
    className?: string;
    square?: boolean;
    hideStatus?: boolean;
    showTooltip?: boolean;

    size?: keyof typeof sizes;
    imgSize?: string;
    statusSize?: string
}

const NoPicture = <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>

const sizes = {
    xs: {
        img: 'h-6 w-6',
        status: 'h-1.5 w-1.5'
    },
    sm: {
        img: 'h-8 w-8',
        status: 'h-2 w-2'
    },
    md: {
        img: 'h-10 w-10',
        status: 'h-2.5 w-2.5'
    },
    lg: {
        img: 'h-12 w-12',
        status: 'h-3 w-3'
    },
    xl: {
        img: 'h-14 w-14',
        status: 'h-3.5 w-3.5'
    },
    '2xl': {
        img: 'h-16 w-16',
        status: 'h-4 w-4'
    },
}

export const Avatar: FC<AvatarProps> = ({
                                            user,
                                            className,
                                            size: sizeName = "md",
                                            square,
                                            hideStatus,
                                            showTooltip,
    imgSize, statusSize
                                        }) => {
    const { image, name, email, online } = user || {}
    const size = sizes[sizeName]
    if(imgSize) size.img = imgSize
    if(statusSize) size.status = statusSize

    const Image = (
        <span className={clsx('inline-block relative', className)}>
            {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    referrerPolicy="no-referrer"
                    alt={`Profile picture of ${name || email}`}
                    className={clsx(size.img, square ? 'rounded-md' : 'rounded-full')}
                />
            ) : (
                <span className={clsx('block overflow-hidden bg-gray-100', size.img, square ? 'rounded-md' : 'rounded-full')}>{NoPicture}</span>
            )}


            {!hideStatus &&
                (square ? (
                    <span className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 block border-2 border-white rounded-full">
                        <span className={clsx('block rounded-full', size.status, online ? 'bg-green-400' : 'bg-gray-300' )} />
                    </span>
                ) : (
                    <span className={clsx('absolute bottom-0 right-0 block rounded-full ring-2 ring-white', size.status, online ? 'bg-green-400' : 'bg-gray-300')} />
                ))
            }
        </span>
    )

    if(showTooltip && user) {
        return <Tooltip render={<UserToolTip user={user} />}>
            {Image}
        </Tooltip>
    } else {
        return Image
    }
}

interface UserToolTipProps {
    user: Partial<User>
}

export const UserToolTip: FC<UserToolTipProps> = ({ user }) => {
        return (
            <div className="flex justify-between">
                <div>
                    <p className="text-base">{user.name}</p>
                    {user.role && <RoleBadge role={user.role} />}
                </div>
                <Avatar user={user} size="2xl"/>
            </div>
        )
}
