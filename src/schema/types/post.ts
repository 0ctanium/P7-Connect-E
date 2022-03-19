import {objectType} from "nexus";

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id("id")

    // t.model.group()
    // t.model.author()

    t.field('createdAt', { type: "DateTime" })
    t.field('updatedAt', { type: "DateTime" })
  },
})

// export const PostQueries = extendType({
//   type: 'Query',
//   definition: (t) => {
//     t.crud.post()
//     t.crud.posts()
//   },
// })
