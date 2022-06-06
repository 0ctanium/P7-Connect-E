import {AdminLayout, AdminLayoutHeader} from "components/layout/Admin";
import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from "next";
import {useCallback} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import Link from "next/link";
import {
    GetGroupInfoDocument,
    GetGroupInfoQuery,
    GetGroupInfoQueryVariables, GroupFragment,
    useUpdateGroupMutation
} from "generated/graphql";
import {getSession} from "next-auth/react";
import {checkSessionRole} from "lib/session";
import {useRefetch} from "hooks";
import {createApolloContext} from "schema/context";
import {initializeApollo} from "services/apollo/client";
import {UpdateGroupForm, Inputs} from "components/forms/UpdateGroup";

interface PageProps {
    group: GroupFragment
}

export const GroupDashboard: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ group }) => {
    const refetch = useRefetch()
    const [updateGroup] = useUpdateGroupMutation()

    const handleUpdate = useCallback((data: Inputs) => {
        return updateGroup({
            variables: {
                id: group.id,
                data
            }
        }).then(() => {
            return refetch()
        }).catch((err) => {
            console.error(err)
            toast.error("Une erreur est intervenue lors le la mise à jour du groupe")
        })
    }, [group.id, refetch, updateGroup])



    return (
        <AdminLayout current="groups">
            <AdminLayoutHeader title="Modification du groupe" desc="Modifiez les paramètres du groupe." actions={
                <Link href={`/admin/groups`}>
                    <a className="btn btn-white mr-4">Retourner à la liste des groupes</a>
                </Link>
            }/>

            <UpdateGroupForm group={group} onUpdate={handleUpdate} />
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps<PageProps, { id: string }> = async ({ req, res, params}) => {
    const user = await getSession({ req, })

    if(!checkSessionRole(user, Role.ADMIN)) {
        res.statusCode = 403
        throw new Error('test')
    }

    if(!params || !params.id) {
        return {
            notFound: true
        }
    }

    const context = await createApolloContext(null)
    const apollo = await initializeApollo(null, context)

    const { data } = await apollo.query<GetGroupInfoQuery, GetGroupInfoQueryVariables>({
        query: GetGroupInfoDocument,
        variables: {
            id: params.id
        }
    })

    if(!data || !data.group) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            group: data.group
        }
    };
}


GroupDashboard.auth = {
    roles: [Role.ADMIN],
}

export default GroupDashboard
