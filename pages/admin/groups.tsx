import {AdminLayout, AdminLayoutHeader, AdminLayoutSection} from "components/layout/Admin";
import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from "next";
import {useCallback, useState} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import {GroupTable} from "components/table/preset/groups/GroupsTable";
import {SubmitHandler} from "react-hook-form";
import {NewGroupFormSlideOver, useNewGroupForm} from "components/forms/NewGroup";
import {
    GetAllGroupsDocument, GetAllGroupsQuery, GetAllGroupsQueryVariables,
    useCreateGroupMutation,
} from "generated/graphql";
import {getSession} from "next-auth/react";
import {checkSessionRole} from "lib/session";
import {initializeApollo} from "services/apollo/client";
import {useRefetch} from "hooks";
import {createApolloContext} from "schema/context";
import {NewGroupInputs} from "types";

type PageProps = GetAllGroupsQuery

export const GroupsDashboard: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ groups }) => {
    const refetch = useRefetch()
    const [createLoading, setCreateLoading] = useState(false)
    const [createGroup] = useCreateGroupMutation()
    const form = useNewGroupForm();
    const { reset } = form

    const [open, setOpen] = useState(false)
    const handleSubmit: SubmitHandler<NewGroupInputs> = useCallback((data) => {
        setCreateLoading(true)
        createGroup({
            variables: { data }
        }).then(() => {
            toast.success('Groupe créé avec succès')
            return refetch()
        }).then(() => {
            reset()
            setOpen(false)
        }).catch((err) => {
            console.error(err)
            toast.error('Une erreur est survenue')
        }).finally(() => {
            setCreateLoading(false)
        })
    }, [createGroup, refetch, reset])

    return (
        <AdminLayout current="groups">
            <AdminLayoutHeader  title="Groupes" desc="Ajoutez ou supprimer des groupes" actions={
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setOpen(true)}
                >
                    Ajouter un groupe
                </button>
            }/>

            <AdminLayoutSection>
                <div className="py-4">
                    <div className="md:overflow-hidden md:rounded-lg shadow -mx-4 sm:-mx-6 md:mx-0">
                        <GroupTable
                            data={groups}
                            onDelete={console.log}
                        />
                    </div>
                </div>
            </AdminLayoutSection>

            <NewGroupFormSlideOver open={open} onClose={setOpen} onSubmit={handleSubmit} form={form} loading={createLoading} />
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
    const user = await getSession(ctx)

    if(!checkSessionRole(user, Role.ADMIN)) {
        ctx.res.statusCode = 403
        throw new Error('test')
    }

    const context = await createApolloContext(null)
    const apollo = await initializeApollo(null, context)

    const res = await apollo.query<GetAllGroupsQuery, GetAllGroupsQueryVariables>({
        query: GetAllGroupsDocument
    })

    return { props: res.data };
}

GroupsDashboard.auth = {
    roles: [Role.ADMIN],
}

export default GroupsDashboard
