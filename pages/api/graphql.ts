import { ApolloServer } from 'apollo-server-micro';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  PluginDefinition,
} from 'apollo-server-core';
import { processRequest } from 'graphql-upload';
import { NextApiHandler } from 'next';
import cors from 'micro-cors';
import { RequestHandler } from 'micro';

const { schema } = require('schema');
const { createApolloContext } = require('schema/context');

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '11mb',
  },
};

let apolloServerHandler: NextApiHandler;

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    const plugins: PluginDefinition[] = [];
    if (process.env.NODE_ENV !== 'production') {
      plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
    }
    const apolloServer = new ApolloServer({
      schema: schema,
      context: createApolloContext,
      plugins,
    });

    await apolloServer.start();

    apolloServerHandler = apolloServer.createHandler({
      path: '/api/graphql',
    });
  }

  return apolloServerHandler;
}

const handler: NextApiHandler = async (req, res) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.startsWith('multipart/form-data')) {
    // @ts-ignore
    req.filePayload = await processRequest(req, res);
  }

  const apolloServerHandler = await getApolloServerHandler();

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  return apolloServerHandler(req, res);
};

export default cors()(handler as RequestHandler);
