import {gql, useMutation, useQuery} from "@apollo/client";
import {signOut, useSession} from "next-auth/react";
import {NextPage} from "next";
import {Layout} from "components/layout";
import {useRouter} from "next/router";
import {NexusGenFieldTypes} from "../../generated/nexus-typegen";
import {Spinner} from "../../src/icons/Spinner";
import {Field} from "../../src/components/fields/Field";
import {FC, FormEventHandler, useCallback, useRef} from "react";

const getGroupInfoAndPostQuery = gql`
    query GetGroupInfoAndPost($id: ID!, $cursor: ID) {
        group(id: $id) {
            name
            description
            banner
            
            restricted
            
            posts(cursor: $cursor) {
                id
                
                text
                media
                author {
                    id
                    
                    name
                    image
                }
                
                createdAt
            }
        }
    }
`

const GroupPage: NextPage = () => {
    const { id: groupId } = useRouter().query
    const { loading, data } = useQuery<{ group: NexusGenFieldTypes["Group"] }>(getGroupInfoAndPostQuery, {
        variables: {
            id: groupId
        }
    })

    if(loading) {
        return <Spinner className="w-6 h-6 mx-auto text-gray-800 animate-spin" />
    }

    const group = data?.group

    return (
        <Layout current='feed'>
            <div className="flex justify-center mt-8 text-center">
                <div className="flex-auto">
                    <PostForm groupId={groupId} />
                    {JSON.stringify(group, null, 4)}
                </div>
            </div>
        </Layout>
    )
}

const createPostMutation = gql`
    mutation CreatePost($group: ID!, $text: String!) {
        createPost(group: $group, text: $text) {
            id
        }
    }
`

export const PostForm: FC<{ groupId: string }> = ({ groupId }) => {
    const [createPost] = useMutation(createPostMutation, {
        variables: {
            group: groupId
        }
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()
        // @ts-ignore
        const text: string = e.target.text.value

        console.log({ text })

        return createPost({
            variables: {
                text
            }
        })
    }, [createPost])

    console.log('render')

    return (
        <form onSubmit={handleSubmit}>
            <Field name="text" required />
            <button type="submit" className="btn btn-primary">Envoyer</button>
        </form>
    )
}

GroupPage.auth = {}

export default GroupPage
