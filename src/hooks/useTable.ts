import {useContext, useMemo} from "react";
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
    key: Key;
    setCurrentEditing(): void,
    cancelEditing(): void;
}

export const useTableCell = <
    D extends Record<string, any> = Record<string, unknown>,
    Key = any,
    Edit = D
    >(row: D): TableCell<D, Key, Edit> => {
    const ctx = useReactTable<D, Key, Edit>();

    const {
        resolveKey,
        setEditing,
        editing
    } = ctx

    const key = useMemo(() => resolveKey(row), [resolveKey, row])

    return {
        ...ctx,
        key,
        setCurrentEditing: () => setEditing(key),
        cancelEditing: () => setEditing(null),
        isEditing: key === editing
    }
}
