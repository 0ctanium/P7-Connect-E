import React, {HTMLAttributes} from 'react'
import {Hooks} from "react-table";

export const useIndeterminateCheckbox = <D extends object = {}>(hooks: Hooks<D>): void => {
    hooks.visibleColumns.push((columns) => [
        {
            id: 'selection',
            headerClasses: () => 'px-6 py-3 leading-[0] w-0',
            // @ts-ignore
            Header: ({ getToggleAllPageRowsSelectedProps }) =>  <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />,
            // @ts-ignore
            Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        },
        ...columns,
    ]);
}

// eslint-disable-next-line react/display-name
export const IndeterminateCheckbox = React.forwardRef<
    HTMLInputElement,
    {
        indeterminate: any;
    } & HTMLAttributes<HTMLInputElement>
    >(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
        // @ts-ignore
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input
                type="checkbox"
                className="form-checkbox"
                // @ts-ignore
                ref={resolvedRef}
                {...rest}
            />
        </>
    );
});
