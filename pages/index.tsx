import type { NextPage } from 'next'
import Image from 'next/image'
import {gql, useQuery} from "@apollo/client";
import {signIn, signOut, useSession} from "next-auth/react";

export const exampleQuery = gql`
  query example {
    users {
      name
    }
  }
`


const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const { data, loading: queryLoading, refetch } = useQuery(exampleQuery, { notifyOnNetworkStatusChange: true })

  if(status === "loading") {
    return (
        <div className="flex justify-center mt-8 text-center">
          <div className="flex-auto">
            <div className="text-lg mb-2">Loading...</div>
          </div>
        </div>
    )
  }

  if (session) {
    return (
        <div className="flex justify-center mt-8 text-center">
          <div className="flex-auto">
            {session?.user?.image && (
                <img
                    src={session.user.image}
                    alt={session.user.email ?? session.user.name ?? "Profile picture"}
                    width="60"
                    height="60"
                    loading="lazy"
                    className="h-16 w-16 rounded-full mx-auto mb-2"
                />
            )}
            <div className="text-lg mb-2">Hello, {session?.user?.email ?? session?.user?.name}</div>
            <div className="mb-2">
              gql test query: {queryLoading ? 'fetching...' : data?.users?.map((u: any) => u.name).join(', ')}
              <button className="btn-blue ml-2" onClick={() => refetch()}>
                Refetch!
              </button>
            </div>
            <button className="btn-green" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>
    )
  } else {
    return (
        <div className="flex justify-center mt-8 text-center">
          <div className="flex-auto">
            <div className="text-lg mb-2">You are not logged in!</div>
            <button className="btn-green" onClick={() => signIn()}>
              Sign in
            </button>
          </div>
        </div>
    )
  }
}

export default Home
