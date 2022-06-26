import React, { FC } from 'react';
import { Post as PostType } from 'generated/graphql';
import { Avatar, UserToolTip } from 'components/Avatar';
import Link from 'next/link';
import { PostActions } from './PostActions';
import { PostDate } from './PostDate';
import { PostReactionSelector } from './PostReactionSelector';

export const Post: FC<{ post: PostType }> = ({ post }) => {
  const { author, group } = post;

  return (
    <div className="bg-white rounded shadow px-8 py-4 flex flex-col">
      <div className="flex flex-row text-left h-10 mb-6">
        <Link href={`/profile/${author?.id}`}>
          <a>
            <Avatar user={author} showTooltip />
          </a>
        </Link>
        <div className="ml-4 flex flex-col items-start">
          <UserToolTip user={author}>
            <Link href={`/profile/${post.authorId}`}>
              <a className="text-base font-medium leading-6 hover:underline">
                {author?.name || 'Utilisateur inconnu'}
              </a>
            </Link>
          </UserToolTip>
          <Link href={`/post/${post.id}`}>
            <a>
              <PostDate
                date={post.createdAt}
                className="text-xs font-light hover:underline"
              />
            </a>
          </Link>
        </div>

        <div className="flex-grow" />

        <div className="-mr-4">
          <PostActions post={post} />
        </div>
      </div>

      <p className="text-left">{post.text}</p>

      <PostReactionSelector />
    </div>
  );
};
