import { TableInstance } from 'react-table';
import React, {Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {isPromise} from "../../lib/utils";
import { toast } from "react-toastify";

export interface TableProps<
    D extends Record<string, any> = Record<string, unknown>,
    Key extends string = any,
    Edit extends Record<string, any> = D
    > {
    instance: TableInstance<D>;
    loading?: boolean;

    error?: any;
    resolveKey?(row: D): Key

    // Called when an edition is confirmed
    onEdit?(key: Key, value: Edit | null): any | Promise<any>
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
    dispatchLoadingAction(action: Promise<any> | any, rows: Key[]): Promise<void>

    selectedRows: Key[]

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
    Key extends string = any,
    Edit = D
    >({
                               children,

                               instance,
                               loading = false,
                               error,
                               resolveKey = (row) => row.id,

                               onEdit,
                           }: PropsWithChildren<TableProps<D, Key, Edit>>): JSX.Element => {
    const count = instance.count || instance.pageCount * instance.state.pageSize

    const [editing, setEditing] = useState<Key | null>(null)
    const [editValues, edit] = useState<Edit | null>(null)
    const [rowLoading, setRowLoading] = useState<Key[]>([])

    const selectedRows = useMemo(() => {
        return Object.entries(instance.state.selectedRowIds).reduce<Key[]>((acc, [id, selected]) => {
            if(selected) {
                acc.push(id as Key)
            }

            return acc
        }, [])
    }, [instance.state.selectedRowIds])

    const dispatchLoadingAction = useCallback(async(action: Promise<any> | any, rows: Key[]) => {
        return new Promise((resolve, reject) => {
            const res = action(rows) as Promise<void>

            if(isPromise(res)) {
                // Set loading state
                setRowLoading((state) => {
                    return Array.from(new Set([...state, ...rows]))
                })

                res.then(resolve).catch(reject).finally(() => {
                    // Remove loading state
                    setRowLoading((state) => {
                        return state.filter(k => !rows.includes(k))
                    })
                })
            } else { resolve(res) }
        })
    }, [])

    const submit = useCallback(() => {
        if(onEdit) {
            if(!editing) {
                toast.error("Aucune ent??e n'est en cours d'??dition")
                return
            }
            if(!editValues) {
                toast.error("Aucune modification n'a ??t?? effectu??")
                return
            }

            dispatchLoadingAction(() => onEdit(editing, editValues), [editing]).then(() => {
                setEditing(null)
            }).catch((err) => {
                console.error(err)
                toast.error("Erreur interne")
            })
        }
    }, [dispatchLoadingAction, editValues, editing, onEdit])

    // Clear editValues when edited row change
    useEffect(() => {
        edit(null)
    }, [editing])

    return (
        <TableContext.Provider value={{
            instance,
            loading,
            error,
            count,

            editValues,
            edit,

            rowLoading,
            setRowLoading,
            dispatchLoadingAction,

            selectedRows,

            editing,
            setEditing,

            submit,
            resolveKey
        }}>
            {children}
        </TableContext.Provider>
    );
}
