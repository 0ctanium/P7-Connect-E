import { SchemaLink } from "@apollo/client/link/schema";
import { asNexusMethod, makeSchema } from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import path from "path";

import { Query } from 'schema/query';
import { Mutation } from 'schema/mutation';
import { User } from 'schema/user';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date')

export const schema = makeSchema({
  types: [
      Query,
      Mutation,
      User,
      GQLDate
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
})

const link = new SchemaLink({ schema })
