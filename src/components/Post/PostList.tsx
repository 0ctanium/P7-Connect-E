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
  skeletonNumber = 3,
}) => {
  if (loading || true)
    return (
      <div className="space-y-4 max-w-xl mx-auto w-full">
        {Array.from(Array(skeletonNumber).keys()).map((i) => (
          <SkeletonPost key={i} />
        ))}
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
