import {ApolloClient, InMemoryCache, NormalizedCacheObject} from '@apollo/client'
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";

let apolloClient: ApolloClient<NormalizedCacheObject>

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    return require('schema').link
  } else {
    return createUploadLink({
        uri: '/api/graphql',
        credentials: 'same-origin',
    })
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState?: NormalizedCacheObject) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
