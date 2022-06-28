import { SchemaLink } from '@apollo/client/link/schema';
import ResolverContext = SchemaLink.ResolverContext;
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphLink(context: ResolverContext = {}) {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const schema = require('../../schema');

    return new SchemaLink({ schema: schema.schema, context });
  } else {
    const createUploadLink = require('apollo-upload-client/public/createUploadLink.js');

    return createUploadLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

export const cache = new InMemoryCache();

async function createApolloClient(context?: ResolverContext) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: await createIsomorphLink(context),
    cache,
  });
}

export async function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext
) {
  const _apolloClient = apolloClient ?? (await createApolloClient(context));

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
