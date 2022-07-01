import { Menu, Transition } from '@headlessui/react';
import React, {
  FC,
  forwardRef,
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
interface DropdownItemProps
  extends Partial<ItemRenderPropArg>,
    Omit<HTMLAttributes<HTMLElement>, 'className'> {
  as?: ReactNode;
  icon?: IconType;
  label?: ReactNode;
  className?: string | ((classes: string) => string);
  iconClasses?: string | ((classes: string) => string);
}

export type DropdownAction =
  | DropdownItemProps
  | React.ExoticComponent<DropdownItemProps>;
export type DropdownActions = DropdownAction[] | DropdownActions[];

const DropdownGroup: FC<{ actions: DropdownActions }> = ({ actions }) => {
  return (
    <>
      {actions.map((item, i) => {
        if (Array.isArray(item)) {
          return (
            <div className="py-1" key={i}>
              <DropdownGroup actions={item} />
            </div>
          );
        } else {
          if (typeof item === 'function') {
            return (
              <Menu.Item key={i}>
                {/* @ts-ignore */}
                {(props) => item(props)}
              </Menu.Item>
            );
          } else {
            return (
              <Menu.Item key={i}>
                {(props) => (
                  // @ts-ignore
                  <DropdownItem
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

const placements = {
  'bottom-right': 'origin-right right-0 mt-2',
  'bottom-left': 'origin-left left-0 mt-2',
  'top-right': 'origin-right top-0 mb-2',
  'top-left': 'origin-left -top-2 transform -translate-y-full',
  left: 'origin-left transform -right-2 top-1/2 -translate-y-1/2 translate-x-full',
};

type DropdownProps = {
  menu: DropdownActions;
  placement?: keyof typeof placements;
} & HTMLAttributes<HTMLButtonElement>;

export const Dropdown: FC<DropdownProps> = ({
  children,
  placement = 'bottom-right',
  menu,
}) => {
  return (
    <Menu as="div" className="z-10 relative inline-block text-left">
      <Menu.Button>{children}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items
          className={clsx(
            placements[placement],
            'absolute w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none overflow-hidden'
          )}>
          <DropdownGroup actions={menu} />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownItem = forwardRef(
  (
    {
      as: Component = 'div',
      active,
      label,
      icon: Icon,
      children,
      className,
      iconClasses,
      ...props
    }: PropsWithChildren<HTMLAttributes<HTMLElement> & DropdownItemProps>,
    ref
  ): JSX.Element => {
    return (
      // @ts-ignore
      <Component
        ref={ref}
        className={clsx(
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
          'group flex items-center px-4 py-2 text-sm',
          className
        )}
        {...props}>
        {Icon && (
          <Icon
            className={clsx(
              'mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500',
              iconClasses
            )}
            aria-hidden="true"
          />
        )}
        {label}
      </Component>
    );
  }
);
DropdownItem.displayName = 'DropdownItem';
