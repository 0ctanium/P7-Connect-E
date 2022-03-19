import {objectType} from "nexus";

export const AffectedRowsOutput = objectType({
  name: 'AffectedRowsOutput',
  definition(t) {
    t.int('count')
  }
})
