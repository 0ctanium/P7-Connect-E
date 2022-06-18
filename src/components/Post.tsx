import React, {FC, useMemo} from 'react'
import {Post as PostType, useGetGroupPostsQuery, useGetUserPostsQuery} from "generated/graphql";
import {LoadingSpinner} from "./LoadingSpinner";
import Image from "next/image";
import {Avatar} from "./Avatar";
import moment, {MomentInput} from "moment";
import {Tooltip} from "./Tooltip";

const PostDate: FC<{ date: MomentInput}> = ({ date }) => {
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

    return <Tooltip render={completeDate} className="tooltip-border-transparent tooltip-bg-gray-900/80 text-white text-xs font-light" config={{ delayShow: 200 }}>{calendar}</Tooltip>

}

export const Post: FC<{ post: PostType}> = ({ post }) => {
    const { author, group } = post

    return <div className="bg-white rounded shadow px-8 py-3">
        <div>
            <PostDate date={post.createdAt} />
        </div>
        {author && (
            <div>
                <Avatar user={author} showTooltip hideStatus />
                <p>{author?.name}</p>
            </div>
        )}

        {post.text}
        {/*{JSON.stringify(post, null, 4)}*/}
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
