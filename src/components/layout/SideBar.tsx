import React, {FC} from 'react'
import Link from 'next/link';
import {LoadingSpinner} from "../LoadingSpinner";
import {useGetAllGroupsQuery} from "generated/graphql";

export const SideBar: FC = () => {
    const { loading, data } = useGetAllGroupsQuery()

    if(loading) {
        return <LoadingSpinner className="w-6 h-6" />
    }

    const groups = data?.groups

    return (
        <div className="p-4">
            {(groups && groups.length > 0) ?
                (
                    <div>
                        {groups.map(group => (
                            <Link href={`/groups/${group.id}`} key={group.id}>
                                <a>
                                    <p>{group.name}</p>
                                    <p>{group.description}</p>
                                </a>
                            </Link>
                        ))}
                    </div>
                ) : <p>{"Aucun groupe n'a été créé"}</p>
            }
        </div>
    )
}
