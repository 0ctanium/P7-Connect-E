import { Transition } from '@headlessui/react';
import React from 'react';

import { TooltipProps } from 'types';
import {usePopperTooltip} from "react-popper-tooltip";
import clsx from "clsx";

export const Tooltip: React.FC<TooltipProps> = ({
                                                    children,
                                                    render,
                                                    showArrow,
                                                    config,
                                                    popperOptions,
                                                    className,
                                                }) => {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible
    } = usePopperTooltip(config, popperOptions);

    return (
        <div>
            <div className="cursor-pointer transition-opacity" ref={setTriggerRef}>
                {children}
            </div>
            <Transition
                as="div"
                appear={true}
                unmount={false}
                show={visible}
                enter="transition-opacity duration-200 ease-in-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300 ease-in-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                role="tooltip"
                ref={setTooltipRef}
                {...getTooltipProps({ className: clsx('tooltip', className)})}
            >
                {showArrow && <div {...getArrowProps({ className: 'tooltip-arrow' })} />}
                {render}
            </Transition>
        </div>
    );
};
