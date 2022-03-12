import {extendType, objectType} from "nexus";

export const Media = objectType({
  name: 'Media',
  definition(t) {
    t.model.id()

    t.model.post()

    t.model.addedBy()

    t.model.mimeType()
    t.model.url()

    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const MediaQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.media()
  },
})
