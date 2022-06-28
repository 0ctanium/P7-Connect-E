import React, { FC } from 'react';
import { Post as PostType } from 'generated/graphql';
import Image from 'next/image';

export const PostMedias: FC<{
  post: PostType;
}> = ({ post }) => {
  const medias = post.media;

  if (!medias || !medias.length) return null;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-4">
      {medias.map((media) => (
        <li
          key={media.id}
          className="relative group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden">
          {/* TODO: add alt to datamodel */}
          <Image
            src={media.url}
            alt=""
            layout="fill"
            objectFit="cover"
            className="object-cover pointer-events-none"
          />
        </li>
      ))}
    </ul>
  );
};
