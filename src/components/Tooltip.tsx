import { Transition } from '@headlessui/react';
import React, { useState } from 'react';
import clsx from 'clsx';
import { usePopper } from 'react-popper';

import { TooltipProps } from 'types';
import { useResizeObserver } from 'hooks';

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  className,
  render,
  show,
}) => {
  const [showTooltip, setTooltipState] = useState(show);
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes, update } = usePopper(
    // @ts-ignore
    referenceElement || null,
    popperElement || null,
    {
      placement: 'auto',
      strategy: 'fixed',
    }
  );

  // @ts-ignore
  useResizeObserver(referenceElement || null, () => {
    if (update) {
      update();
    }
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setTooltipState(true)}
      onMouseLeave={() => setTooltipState(false)}>
      <div className="cursor-pointer" ref={setReferenceElement}>
        {children}
      </div>
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        <Transition
          as="div"
          appear={true}
          unmount={false}
          show={!!showTooltip}
          enter="transition duration-200 ease-in-out"
          enterFrom="scale-0"
          enterTo="scale-100"
          leave="transition duration-300 ease-in-out"
          leaveFrom="scale-100"
          leaveTo="scale-0"
          role="tooltip"
          className={clsx(
            'transform',
            className ||
              'z-20 p-4 w-64 text-gray-50 bg-gray-800 rounded shadow-lg'
          )}>
          {render}
        </Transition>
      </div>
    </div>
  );
};
