import { Menu, Transition } from '@headlessui/react';
import React, {
  FC,
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { IconType } from 'react-icons';
import clsx from 'clsx';

interface ItemRenderPropArg {
  active: boolean;
  disabled: boolean;
}
interface DropdownItemProps {
  as?: ReactNode;
  icon: IconType;
  label: ReactNode;
}

export type DropdownAction =
  | DropdownItemProps
  | React.ExoticComponent<ItemRenderPropArg & DropdownItemProps>;
export type DropdownActions = DropdownAction[] | DropdownActions[];

interface DropdownProps {
  menu: DropdownActions;
}

const DropdownGroup: FC<{ actions: DropdownActions }> = ({ actions }) => {
  return (
    <>
      {actions.map((item) => {
        if (Array.isArray(item)) {
          return (
            <div className="py-1">
              <DropdownGroup actions={item} />
            </div>
          );
        } else {
          if (typeof item === 'function') {
            return (
              <Menu.Item>
                {/* @ts-ignore */}
                {(props) => item(props)}
              </Menu.Item>
            );
          } else {
            return (
              <Menu.Item>
                {(props) => (
                  <DropdownItem
                    // @ts-ignore
                    {...(item as unknown as DropdownItemProps)}
                    {...props}
                  />
                )}
              </Menu.Item>
            );
          }
        }
      })}
    </>
  );
};

export const Dropdown: FC<DropdownProps> = ({ children, menu }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>{children}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <DropdownGroup actions={menu} />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownItem = <Tag extends HTMLElement = HTMLElement>({
  as: Component = 'div',
  active,
  label,
  icon: Icon,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<Tag> & DropdownItemProps>): JSX.Element => {
  // @ts-ignore
  return (
    <Component
      className={clsx(
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
        'group flex items-center px-4 py-2 text-sm'
      )}
      {...props}>
      <Icon
        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
      {label}
    </Component>
  );
};
