import {useEffect, useMemo, useState} from "react";
import {initializeApollo} from "../services/apollo/client";
import {ApolloClient, NormalizedCacheObject} from "@apollo/client";

export function useApollo(initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> | null {
  const [apolloClient, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)

  useEffect(() => {
    initializeApollo(initialState).then((apollo) => {
      return setClient(apollo);
    })
  }, [initialState])

  return apolloClient
}
