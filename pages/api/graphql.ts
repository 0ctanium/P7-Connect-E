import { ApolloServer } from 'apollo-server-micro'
import { schema } from 'schema'
import {NextApiRequest, NextApiResponse} from "next";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}
