import { TableInstance } from 'react-table';
import React, {PropsWithChildren, useState} from 'react';

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

    onEdit(v: Edit): void
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

    // Edited row
    editing: Key | null
    // Current edit value
    editValues: Edit | null
    // Change edited row
    setEditing(key: Key | null): void
    // Change edited row values
    edit(v: Edit): void

    // Called when an edition is confirmed
    onEdit(v: Edit): void
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

    return (
        <TableContext.Provider value={{
            instance,
            loading,
            count,
            error,

            editing,
            setEditing,

            onEdit,
            resolveKey
        }}>
            {children}
        </TableContext.Provider>
    );
}
