import {objectType} from "nexus";

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.date('createdAt')
    t.string('name')
    t.string('email')
  },
})
