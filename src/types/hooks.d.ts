import { OptionalBooleanFunction } from './utils';

export type UseResizeObserver = (
  ref: HTMLElement | null,
  callback: ResizeObserverCallback
) => void;

export type UseConfirmButton = (options: {
  onConfirm?: OptionalBooleanFunction;
  onDismiss?: OptionalBooleanFunction;
}) => {
  isOpen: boolean;
  close: (value?: boolean) => void;
  open: (value?: boolean) => void;
  confirm: OptionalBooleanFunction;
  dismiss: OptionalBooleanFunction;
};
