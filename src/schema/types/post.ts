import {extendType, objectType} from "nexus";

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.group()
    t.model.author()

    t.model.media({
      filtering: false,
      pagination: false
    })


    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const PostQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.post()
    t.crud.posts()
  },
})
