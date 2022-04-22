import { gql , useMutation} from "@apollo/client";
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from "next";
import {Layout} from "components/layout";
import {NexusGenFieldTypes} from "../../generated/nexus-typegen";
import {Field} from "../../src/components/fields/Field";
import {FC, FormEventHandler, useCallback} from "react";
// import {initializeApollo} from "../../src/services/apollo/client";
import prisma from "../../src/services/prisma";
// import { createContext } from "schema/context";

// const getGroupInfoAndPostQuery = gql`
//     query GetGroupInfoAndPost($id: ID!, $cursor: ID) {
//         group(id: $id) {
//             id
//             name
//             description
//             banner
//
//             restricted
//
//             posts(cursor: $cursor) {
//                 id
//
//                 text
//                 #                media
//                 author {
//                     id
//
//                     name
//                     image
//                 }
//
//                 createdAt
//             }
//         }
//     }
// `

interface PageData {
    group: NexusGenFieldTypes["Group"]
}

const GroupPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ group }) => {
    return (
        <Layout current='feed'>
            <div>
                <img src={group?.banner || ''} alt={`Bannière du groupe ${group?.name}`}/>
            </div>
            <div className="flex justify-center mt-8 text-center">
                <div className="flex-auto">
                    <PostForm groupId={group?.id} />
                    {JSON.stringify(group, null, 4)}
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<PageData, { id: string }> = async ({ params }) => {
    if(!params) {
        return {
            notFound: true
        }
    }

    // const { id } = params
    // const context = await createContext({})
    // const apollo = await initializeApollo(null, context)
    //
    // const res = await apollo.query<PageData>({
    //     query: getGroupInfoAndPostQuery,
    //     variables: {
    //         id
    //     }
    // })
    //
    // console.log(res)

    return {
        props: {},
        revalidate: 1 // 1 minute
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





const createPostMutation = gql`
    mutation CreatePost($group: ID!, $text: String!) {
        createPost(group: $group, text: $text) {
            id
        }
    }
`

export const PostForm: FC<{ groupId: string }> = ({ groupId }) => {
    const [createPost] = useMutation(createPostMutation)

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()
        // @ts-ignore
        const text: string = e.target.text.value

        return createPost({
            variables: {
                group: groupId,
                text
            }
        })
    }, [createPost, groupId])

    return (
        <form onSubmit={handleSubmit}>
            <Field name="text" required />
            <button type="submit" className="btn btn-primary">Envoyer</button>
        </form>
    )
}

GroupPage.auth = {}

export default GroupPage
