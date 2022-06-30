import React, { FC } from 'react';
import { Post as PostType } from 'generated/graphql';
import { Post } from './Post';
import { LoadingSpinner } from '../LoadingSpinner';
import { SkeletonPost } from './SkeletonPost';

interface PostListProps {
  posts?: PostType[];
  loading?: boolean;
  onLoadMore?: () => void;
  skeletonNumber?: number;
}

export const PostList: FC<PostListProps> = ({
  posts = [],
  loading,
  onLoadMore,
  skeletonNumber = 5,
}) => {
  if (loading)
    return (
      <div className="space-y-4 max-w-xl mx-auto w-full">
        {Array.from(Array(skeletonNumber).keys()).map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );

  if (!posts || !posts.length)
    return (
      <div className="text-gray-500 pt-8 text-sm">
        <p>{"Aucune publication n'a été posté pour le moment."}</p>
        <p>{'Soyez le premier à dire de merveilleuses choses.'}</p>
      </div>
    );

  return (
    <div className="space-y-4 max-w-xl mx-auto w-full">
      {posts.map((post) => (
        <Post post={post as PostType} key={post.id} />
      ))}
    </div>
  );
};
