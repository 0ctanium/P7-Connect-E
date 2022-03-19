import {useQuery} from "@apollo/client";
import {signOut, useSession} from "next-auth/react";
import {NextPage} from "next";
import {Layout} from "../src/components/layout";

const Home: NextPage = () => {
    const { data: session } = useSession({ required: true })

    if(!session) {
        return null
    }

    return (
        <Layout current='feed'>
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
                    <div className="h-screen">
                        <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus asperiores debitis delectus dignissimos doloremque enim eos fuga libero maiores non officia, quis quisquam sequi soluta tempore ullam velit veritatis! Et!</h3>
                    </div>
                    <div className="h-screen">
                        <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus asperiores debitis delectus dignissimos doloremque enim eos fuga libero maiores non officia, quis quisquam sequi soluta tempore ullam velit veritatis! Et!</h3>
                    </div>
                    <div className="h-screen">
                        <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus asperiores debitis delectus dignissimos doloremque enim eos fuga libero maiores non officia, quis quisquam sequi soluta tempore ullam velit veritatis! Et!</h3>
                    </div>

                    <button className="btn-green" onClick={() => signOut()}>
                        Sign out
                    </button>
                </div>
            </div>
        </Layout>
    )


}

Home.auth = {}

export default Home
