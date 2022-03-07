import {useContext} from "react";
import {TableContext, TableContextProps} from "../components/table/Table";

export const useReactTable = <
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    >() => {
    return useContext<TableContextProps<D, Key, Edit>>(TableContext);
}

interface TableCell <
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    > extends TableContextProps<D, Key, Edit> {
    isEditing: boolean
    edit(v: Edit): void,
    setCurrentEditing(): void,
    cancelEditing(): void;
}

export const useTableCell = <
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    >(row: D): TableCell<D, Key, Edit> => {
    const ctx = useContext<TableContextProps<D, Key, Edit>>(TableContext);

    const {
        resolveKey,
        setEditing,
        editing
    } = ctx

    return {
        ...ctx,
        setCurrentEditing: () => setEditing(resolveKey(row)),
        cancelEditing: () => setEditing(null),
        isEditing: resolveKey(row) === editing
    }
}
