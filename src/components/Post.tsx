import React, {FC} from 'react'
import {Post as PostType, useGetGroupPostsQuery, useGetUserPostsQuery} from "generated/graphql";
import {LoadingSpinner} from "./LoadingSpinner";
import Image from "next/image";
import {Avatar} from "./Avatar";

export const Post: FC<{ post: PostType}> = ({ post }) => {
    const { author, group } = post

    return <div>
        {author && (
            <div>
                <Avatar user={author} showTooltip hideStatus />
                <p>{author?.name}</p>
            </div>
        )}
        {post.createdAt}

        {post.text}
        {/*{JSON.stringify(post, null, 4)}*/}
    </div>
}




export const GroupPosts: FC<{ groupId: string }> = ({ groupId }) => {
    const { data, loading} = useGetGroupPostsQuery({ variables: { id: groupId } })

    if(loading) return <LoadingSpinner />

    if(!data) return <p>Ce groupe ne contient aucun post</p>

    return <div>
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
