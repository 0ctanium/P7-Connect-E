import {gql, useQuery} from "@apollo/client";
import {signIn, signOut, useSession} from "next-auth/react";
import {NextPage} from "next";
import {Role} from "constants/role";

export const exampleQuery = gql`
  query example {
    example {
        message
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
                // eslint-disable-next-line @next/next/no-img-element
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
              gql test query: {queryLoading ? 'fetching...' : data.example.message}
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

Home.auth = {}

export default Home
