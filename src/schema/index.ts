import { gql } from '@apollo/client'
import {makeExecutableSchema} from "@graphql-tools/schema";
import {resolvers} from "../resolvers";
import {SchemaLink} from "@apollo/client/link/schema";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    status: String!
  }
  type Query {
    viewer: User
  }
`

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const link = new SchemaLink({ schema })
