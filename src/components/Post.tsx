import React, {FC, HTMLProps, useMemo} from 'react'
import {Post as PostType, useGetGroupPostsQuery, useGetUserPostsQuery} from "generated/graphql";
import {LoadingSpinner} from "./LoadingSpinner";
import Image from "next/image";
import {Avatar, UserToolTip} from "./Avatar";
import moment, {MomentInput} from "moment";
import {Tooltip} from "./Tooltip";
import Link from "next/link";

const PostDate: FC<{ date: MomentInput} & HTMLProps<HTMLParagraphElement>> = ({ date, ...props }) => {
    const calendar = useMemo(() => moment(date).calendar({
        lastDay : "[hier à] LT",
        sameDay : "LT",
        nextDay : "[demain à] LT",
        nextWeek: "dddd [prochain à] LT",
        lastWeek: "dddd [dernier à] LT",
        sameElse: function(now) {
            if(moment(this as MomentInput).year() != moment(now).year()) {
                return "D MMMM YYYY"
            } else {
                return "[le] D MMMM [à] LT"
            }
        }
    }), [date])
    const completeDate = useMemo(() => moment(date).format("[le] dddd D MMMM YYYY [à] LT"), [date])

    return (
        <Tooltip render={completeDate} className="tooltip-border-transparent tooltip-bg-gray-900/80 text-white text-xs font-light" config={{ delayShow: 200 }}>
            <p {...props}>{calendar}</p>
        </Tooltip>
    );

}

export const Post: FC<{ post: PostType}> = ({ post }) => {
        const { author, group } = post

        return <div className="bg-white rounded shadow px-8 py-4 flex flex-col">
            <div className="flex flex-row text-left h-10 mb-6">
                <Link href={`/profile/${author?.id}`}><a><Avatar user={author} showTooltip /></a></Link>
                <div className="ml-4">
                    <UserToolTip user={author}>
                        <Link href={`/profile/${author?.id}`}><a className="text-base font-medium leading-6 hover:underline">{author?.name || 'Utilisateur inconnu'}</a></Link>
                    </UserToolTip>
                    <Link href={`/post/${post.id}`}><a><PostDate date={post.createdAt} className="text-xs font-light hover:underline" /></a></Link>
                </div>
            </div>

            <p className="text-left">
                {post.text}
            </p>
        </div>
    }

export const GroupPosts: FC<{ groupId: string }> = ({ groupId }) => {
        const { data, loading} = useGetGroupPostsQuery({ variables: { id: groupId } })

        if(loading) return <LoadingSpinner />

        if(!data) return <p>Ce groupe ne contient aucun post</p>

        return <div className="max-w-xl mx-auto space-y-4">
            {data.posts.map(post => <Post post={post as PostType} key={post.id}/>)}
        </div>
    }

export const UserPosts: FC<{ userId: string }> = ({ userId }) => {
        const { data, loading} = useGetUserPostsQuery({ variables: { id: userId } })

        if(loading) return <LoadingSpinner />

        if(!data) return <p>{"Cet utilisateur n'a publié aucun post"}</p>

        return <div>
            {data.posts.map(post => <Post post={post as PostType} key={post.id}/>)}
        </div>
    }
