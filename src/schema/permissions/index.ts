import { shield, and, or } from 'graphql-shield';
import { user, isAdmin, isModerator } from './rules/user';

export const permissions = shield({
  Query: {
    '*': user,
  },
  User: {
    email: and(user, or(isAdmin, isModerator)),
    updatedAt: and(user, or(isAdmin, isModerator)),
  },
  Mutation: {
    createOneGroup: and(user, isAdmin),
    createPost: user,
    deleteManyUser: and(user, isAdmin),
    deleteOneUser: and(user, isAdmin),
    deletePost: user,
    editPost: user,
    removePostReaction: user,
    setPostReaction: user,
    updateOneGroup: and(user, isAdmin),
    updateOneUser: and(user, or(isAdmin, isModerator)),
  },
});
