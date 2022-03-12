import {objectType} from "nexus";

export const GroupMember = objectType({
  name: 'GroupMember',
  definition(t) {
    t.model.role()
    t.model.user()
    t.model.group()
    t.model.assignedAt()
    t.model.assignedBy()
  }
})
