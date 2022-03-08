import { TableInstance } from 'react-table';
import React, {Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useState} from 'react';
import {isPromise} from "../../lib/utils";
import { toast } from "react-toastify";

export interface TableProps<
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    > {
    instance: TableInstance<D>;
    loading: boolean;
    count: number;
    error?: any;
    resolveKey(row: D): Key

    // Called when an edition is confirmed
    onEdit(key: Key, value: Edit | null): any | Promise<any>
}

export interface TableContextProps<
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    > {
    instance: TableInstance<D>;
    loading: boolean;
    count: number;
    error?: any;
    resolveKey(row: D): Key

    rowLoading: Key[]
    setRowLoading: Dispatch<SetStateAction<Key[]>>

    // Edited row
    editing: Key | null
    // Current edit value
    editValues: Edit | null
    // Change edited row
    setEditing: Dispatch<SetStateAction<Key | null>>
    // Change edited row values
    edit: Dispatch<SetStateAction<Edit>>
    // Confirm edited row
    submit(): void
}

export const TableContext = React.createContext<any>({});

export const Table = <
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    >({
                               children,

                               instance,
                               loading,
                               count,
                               error,
                               resolveKey,

                               onEdit,
                           }: PropsWithChildren<TableProps<D, Key, Edit>>): JSX.Element => {
    const [editing, setEditing] = useState<Key | null>(null)
    const [editValues, edit] = useState<Edit | null>(null)
    const [rowLoading, setRowLoading] = useState<Key[]>([])

    // Clear editValues when edited row change
    useEffect(() => {
        edit(null)
    }, [editing])

    const submit = useCallback(() => {
        if(!editing) {
            toast.error("Aucune entée n'est en cours d'édition")
            return
        }
        if(!editValues) {
            toast.error("Aucune modification n'a été effectué")
            return
        }

        const res = onEdit(editing, editValues) as Promise<void>

        if(isPromise(res)) {
            // Set loading state
            setRowLoading((state) => {
                return Array.from(new Set([...state, editing]))
            })

            res.then(() => {
                // Remove current row edition state
                setEditing(null)
            }).finally(() => {
                // Remove loading state
                setRowLoading((state) => {
                    return state.filter(k => k != editing)
                })
            })
        } else {
            // Remove current row edition state
            setEditing(null)
        }
    }, [editValues, editing, onEdit])

    return (
        <TableContext.Provider value={{
            instance,
            loading,
            count,
            error,

            editValues,
            edit,

            rowLoading,
            setRowLoading,

            editing,
            setEditing,

            submit,
            resolveKey
        }}>
            {children}
        </TableContext.Provider>
    );
}
