import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { ensurePluginOrder, Hooks } from 'react-table';

export const useIndeterminateCheckbox = <D extends object = {}>(
  hooks: Hooks<D>
): void => {
  hooks.useInstance.push(({ plugins }) => {
    ensurePluginOrder(plugins, ['useRowSelect'], 'useIndeterminateCheckbox');
  });

  hooks.visibleColumns.push((columns, meta) => [
    {
      id: 'selection',
      headerClasses: 'relative w-12 px-6 sm:w-16 sm:px-8',
      cellClasses: 'relative w-12 px-6 sm:w-16 sm:px-8',
      Header: ({ getToggleAllPageRowsSelectedProps }) => {
        const Actions = meta.instance?.renderActions;
        return (
          <>
            {/* @ts-ignore*/}
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            {Actions && (
              <div className="absolute top-0 left-12 flex h-10 items-center space-x-3 bg-gray-50 sm:left-16">
                {typeof Actions === 'function' ? (
                  <Actions instance={meta.instance} />
                ) : (
                  Actions
                )}
              </div>
            )}
          </>
        );
      },
      // @ts-ignore
      Cell: ({ row }) => (
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      ),
    },
    ...columns,
  ]);
};

useIndeterminateCheckbox.pluginName = 'useIndeterminateCheckbox';

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
        className="form-checkbox absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
        // @ts-ignore
        ref={resolvedRef}
        {...rest}
      />
    </>
  );
});
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
