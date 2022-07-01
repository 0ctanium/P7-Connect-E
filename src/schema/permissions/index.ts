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
    createOneGroup: user,
    createPost: user,
    deleteManyUser: user,
    deleteOneUser: user,
    deletePost: user,
    editPost: user,
    removePostReaction: user,
    setPostReaction: user,
    updateOneGroup: user,
    updateOneUser: user,
  },
});
