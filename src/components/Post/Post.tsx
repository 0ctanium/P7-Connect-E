import React, { FC } from 'react';
import { Post as PostType } from 'generated/graphql';
import { Avatar } from 'components/Avatar';
import { UserToolTip } from 'components/UserToolTip';
import Link from 'next/link';
import { PostActions } from './PostActions';
import { PostDate } from './PostDate';
import { PostReactionSelector } from './PostReactionSelector';
import { Tooltip } from '../Tooltip';
import { PostReactionCount } from './PostReactionCount';
import {
  HiChevronRight,
  HiOutlineChatAlt,
  HiOutlineShare,
} from 'react-icons/hi';
import { PostMedias } from './PostMedias';
import { GroupToolTip } from '../GroupToolTip';

export const Post: FC<{ post: PostType }> = ({ post }) => {
  const { author, group } = post;

  return (
    <div className="bg-white rounded shadow px-6 pt-4 pb-2 flex flex-col">
      <div className="flex flex-row text-left h-10">
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

        {group && (
          <div className="flex items-center h-6">
            <HiChevronRight className="h-full" />
            <GroupToolTip group={group}>
              <Link href={`/groups/${post.groupId}`}>
                <a className="text-base font-medium leading-6 hover:underline">
                  {group.name}
                </a>
              </Link>
            </GroupToolTip>
          </div>
        )}

        <div className="flex-grow" />

        <div className="-mr-4">
          <PostActions post={post} />
        </div>
      </div>

      <p className="text-left pt-6 pb-4">{post.text}</p>
      <PostMedias post={post} />

      <div className="flex justify-between items-center">
        <PostReactionCount counts={post.reactionCount} />
      </div>

      <div className="border-t border-t-gray-300 py-1 mt-2 flex flex-row text-gray-400">
        <PostReactionSelector
          post={post}
          className="flex-1 rounded hover:bg-black/[0.05] transition"
        />
        <Tooltip
          render="Cette fonctionnalité n'est pas disponible pour le moment"
          containerClassName="flex-1 flex justify-center items-center rounded hover:bg-black/[0.05] transition cursor-not-allowed"
          className="tooltip-title">
          <button className="flex justify-center items-center rounded cursor-not-allowed">
            <HiOutlineChatAlt className="w-5 h-5 mr-2" />
            Commenter
          </button>
        </Tooltip>
        <Tooltip
          containerClassName="flex-1 flex justify-center items-center rounded hover:bg-black/[0.05] transition cursor-not-allowed"
          render="Cette fonctionnalité n'est pas disponible pour le moment"
          className="tooltip-title">
          <button className="flex justify-center items-center cursor-not-allowed">
            <HiOutlineShare className="w-5 h-5 mr-2" />
            Partager
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
