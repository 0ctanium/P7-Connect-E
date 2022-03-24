import React, {FC, useCallback, useState} from 'react'
import {gql, useMutation, useQuery} from "@apollo/client";
import {Spinner} from "../../icons/Spinner";
import {NexusGenFieldTypes} from "../../../generated/nexus-typegen";
import {SubmitHandler, useForm} from "react-hook-form";
import {defaultFormProps, NewGroupInputs, NewGroupSlideOver} from "../forms/NewGroup";

const getUserGroups = gql`
    query GetGroups {
        groups {
            id
            name
            banner
        }
    }
`

export const SideBar: FC = () => {
    const { loading, data } = useQuery<{ groups: NexusGenFieldTypes["Group"][] }>(getUserGroups)

    if(loading) {
        return <Spinner className="w-6 h-6 mx-auto text-gray-800 animate-spin" />
    }

    const groups = data?.groups

    return (
        <div className="p-4">
            {(groups && groups.length > 0) ?
                (
                    <div>
                        {groups.map(group => (
                            <div key={group.id}>
                                <p>{group.name}</p>
                                <p>{group.description}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>Aucun groupe n'a été créé</p>
            }
        </div>
    )
}
