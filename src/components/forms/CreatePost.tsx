import {FC, FormEventHandler, useCallback} from "react";
import {useCreatePostMutation} from "generated/graphql";
import {Field} from "../fields/Field";

export const CreatePost: FC<{ groupId: string }> = ({ groupId }) => {
    const [createPost, { data, loading, error }] = useCreatePostMutation()

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
