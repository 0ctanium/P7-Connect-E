import {useMemo} from "react";
import {initializeApollo} from "../services/apollo/client";
import {NormalizedCacheObject} from "@apollo/client";

export function useApollo(initialState: NormalizedCacheObject) {
  return useMemo(() => initializeApollo(initialState), [initialState])
}
