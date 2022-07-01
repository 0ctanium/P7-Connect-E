import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Post as PostType } from 'generated/graphql';
import { Post } from './Post';
import { SkeletonPost } from './SkeletonPost';

interface PostListProps {
  posts?: PostType[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasNext?: boolean;
  skeletonNumber?: number;
}

export const PostList: FC<PostListProps> = ({
  posts = [],
  loading,
  hasNext,
  onLoadMore,
  skeletonNumber = 5,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleScroll() {
      // const bottomThreshold = 100;
      const container = document.getElementById('main-layout');
      if (container) {
        if (
          // container.scrollHeight - container.scrollTop <=
          // container.clientHeight + bottomThreshold
          container.scrollHeight - container.scrollTop ===
          container.clientHeight
        ) {
          if (onLoadMore) {
            onLoadMore();
          }
          return;
        }
      }
    }

    if (onLoadMore && !loading) {
      const container = document.getElementById('main-layout');

      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }
  }, [loading, onLoadMore]);

  if (!posts || !posts.length) {
    if (loading)
      return (
        <div className="space-y-4 max-w-xl mx-auto w-full">
          {Array.from(Array(skeletonNumber).keys()).map((i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      );

    return (
      <div className="text-gray-500 pt-8 text-sm" ref={containerRef}>
        <p>{"Aucune publication n'a été posté pour le moment."}</p>
        <p>{'Soyez le premier à dire de merveilleuses choses.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto w-full">
      {posts.map((post) => (
        <Post post={post as PostType} key={post.id} />
      ))}
      {hasNext ? (
        loading ? (
          <SkeletonPost />
        ) : (
          <p className="p-4 font-medium text-gray-500">
            Scrollez pour charger plus de publications
          </p>
        )
      ) : (
        <p className="p-4 font-medium text-gray-500">
          Bravo. Vous êtes arrivé au bout.
        </p>
      )}
    </div>
  );
};
