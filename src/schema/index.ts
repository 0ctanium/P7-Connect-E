import { SchemaLink } from "@apollo/client/link/schema";
import { makeSchema } from "nexus";
import { applyMiddleware } from "graphql-middleware";
import path from "path";

// Types defs
import * as types from './types';
import { permissions } from './permissions'

// Scalars
import {
  DateTimeResolver as DateTime
} from "graphql-scalars";


export const baseSchema = makeSchema({
  types,
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

// export const schema = applyMiddleware(baseSchema, permissions)
export const schema = baseSchema

export const link = new SchemaLink({ schema })
