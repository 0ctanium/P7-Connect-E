import {useRouter} from "next/router";
import {useCallback} from "react";

export const useRefetch = () => {
  const router = useRouter();

  return useCallback(() => {
        return router.replace(router.asPath);
    }, [router])
}
