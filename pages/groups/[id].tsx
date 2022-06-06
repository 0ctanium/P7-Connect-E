import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from "next";
import {Layout} from "components/layout";
import prisma from "services/prisma";
import {initializeApollo} from "services/apollo/client";
import { createApolloContext } from "schema/context";
import Image from "next/image";
import {
    GetGroupInfoDocument,
    GetGroupInfoQuery,
    GetGroupInfoQueryVariables
} from "generated/graphql";
import {NotFoundErrorPage} from "../../src/components/layout/errors";
import {GroupPosts, Post} from "components/Post";
import {CreatePost} from "../../src/components/forms/CreatePost";

const GroupPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ group }) => {
    if(!group) return <NotFoundErrorPage />

    return (
        <Layout current='feed'>
            <div>
                <div className="relative w-full h-48">
                    {group.banner && <Image src={group.banner} layout="fill" objectFit="cover" alt={`Bannière du groupe ${group.name}`}/>}
                </div>
                <div>
                    <p>{group.name}</p>
                    <p>{group.description}</p>
                    <p>{group.createdAt}</p>
                    {/*{JSON.stringify(group, null, 4)}*/}
                </div>
            </div>
            <div className="flex justify-center mt-8 text-center">
                <div className="flex-auto">
                    <CreatePost groupId={group.id} />
                    <GroupPosts groupId={group.id} />
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<GetGroupInfoQuery, { id: string }> = async ({ params }) => {
    if(!params) {
        return {
            notFound: true
        }
    }

    const { id } = params
    const context = await createApolloContext(null)
    const apollo = await initializeApollo(null, context)

    const res = await apollo.query<GetGroupInfoQuery, GetGroupInfoQueryVariables>({
        query: GetGroupInfoDocument,
        variables: {
            id
        }
    })

    if(!res.data.group) {
        return {
            notFound: true
        }
    }

    return {
        props: res.data,
        revalidate: 1 // minute
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const [groups] = await prisma.$transaction([
        prisma.group.findMany({ select: { id: true } }),
    ])

    const paths = groups.map((group) => ({
        params: { id: group.id },
    }))

    return { paths, fallback: 'blocking' }
}

GroupPage.auth = {}

export default GroupPage
