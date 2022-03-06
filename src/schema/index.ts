import { SchemaLink } from "@apollo/client/link/schema";
import { asNexusMethod, makeSchema } from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import path from "path";

import { permissions } from './permissions'
import { typeDefs } from './types';
import { applyMiddleware } from "graphql-middleware";

export const GQLDate = asNexusMethod(DateTimeResolver, 'date')

export const baseSchema = makeSchema({
  types: [...typeDefs, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'src/schema/context.ts'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(baseSchema, permissions)

const link = new SchemaLink({ schema })
