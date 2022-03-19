import {AdminLayout, AdminLayoutHeader, AdminLayoutSection} from "components/layout/Admin";
import {GetServerSideProps, NextPage} from "next";
import {gql, useQuery} from "@apollo/client";
import {FC, useEffect} from "react";
import {toast} from "react-toastify";
import {Role} from "constants/role";
import {useRouter} from "next/router";
import Link from "next/link";
import {NexusGenFieldTypes} from "../../../generated/nexus-typegen";
import {Section} from "../../../src/components/Section";

export const getServerSideProps: GetServerSideProps = async () => {
    return { props: { htmlClass: 'bg-gray-100', bodyClass: '' } };
}

export const groupQuery = gql`
    query GetGroup($id: String!) {
        group(where: { id: $id }) {
            id
            name
            description
            privacy
            memberCount
            banner
            official
            archived
            
            createdAt
        }
    }
`;


export const UserDashboard: NextPage = () => {
    const { id } = useRouter().query
    const { data, loading, error, refetch } = useQuery(groupQuery, { notifyOnNetworkStatusChange: true, variables: {
            id
        }});

    useEffect(() => {
        if (error) {
            toast.error('Erreur interne');
            console.error(error);
        }
    }, [error]);

    return (
        <AdminLayout current="groups" loading={loading}>
            <AdminLayoutHeader title="Gestion du groupe" desc="Visualisez et administrez le groupe." actions={
                <>
                    <Link href={`/admin/groups`}>
                        <a className="btn btn-white mr-4">Retourner à la liste des groupes</a>
                    </Link>
                    <Link href={`/admin/groups/${id}/edit`}>
                        <a className="btn btn-primary">Paramètres</a>
                    </Link>
                </>
            }/>

            {data?.group && <Form group={data.group} />}
        </AdminLayout>
    )
}

const Form: FC<{ group: NonNullable<NexusGenFieldTypes["Group"]> }> = ({ group }) => {
    return (
        <>
            <Section title="Configuration" desc="Ces informations sont disponibles publiquement. Soyez vigilant aux informations que vous entrez.">
                <div className="space-y-6">
                    {group.name}

                    {group.description}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo de couverture</label>
                        <div className="relative overflow-hidden mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md object-contain min-h-[140px]" >
                            {group.banner && <img src={group.banner} alt="Preview" className="absolute w-full h-full inset-0" />}
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )

}



UserDashboard.auth = {
    roles: [Role.ADMIN],
}

export default UserDashboard
