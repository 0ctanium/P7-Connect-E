import {useEffect, useState} from "react";
import {Hooks, TableInstance, ensurePluginOrder} from "react-table";

export const useControlledPagination = <D extends object = {}>(hooks: Hooks<D>) => {
    hooks.useInstance.push(useInstance);
};

useControlledPagination.pluginName = 'useControlledPagination';

function useInstance<D extends object = {}>(instance: TableInstance<D>) {
    const {
        plugins,

        count = 0,
        fetchData,

        state: { pageSize, pageIndex }
    } = instance;

    ensurePluginOrder(
        plugins,
        ['useControlledPagination'],
        'usePagination',
    );


    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        setPageCount(Math.ceil(count / pageSize));
    }, [count, pageSize]);

    useEffect(() => {
        fetchData && fetchData({ pageIndex, pageSize });
    }, [fetchData, pageIndex, pageSize]);

    Object.assign(instance, { manualPagination: true, pageCount })
}
