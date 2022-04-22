import { ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createContext } from 'schema/context'
import { schema } from "schema";
import {processRequest} from "graphql-upload";
import {NextApiHandler} from "next";
import cors from 'micro-cors';
import {RequestHandler} from "micro";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '11mb'
  },
}

const apolloServer = new ApolloServer({
  schema: schema,
  context: createContext,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: '/api/graphql',
    })
  }

  return apolloServerHandler
}


const handler: NextApiHandler = async (req, res) => {
  const contentType = req.headers["content-type"]
  if (contentType && contentType.startsWith("multipart/form-data")) {
    // @ts-ignore
    req.filePayload = await processRequest(req, res)
  }

  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}


export default cors()(handler as RequestHandler)
