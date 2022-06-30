import { FC, HTMLAttributes, HTMLProps, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { usePopperTooltip } from 'react-popper-tooltip';
import { OptionalBooleanFunction } from './utils';
import { NavigationPage } from 'constants/navigation';

type TooltipParams = Parameters<typeof usePopperTooltip>;
export interface TooltipProps {
  render: ReactNode;
  className?: string;
  containerClassName?: string;
  showArrow?: boolean;
  config?: TooltipParams[0];
  popperOptions?: TooltipParams[1];
}

export type CellComponent<
  D extends Record<string, any> = Record<string, unknown>,
  Props extends Record<string, any> = Record<string, unknown>
> = FC<
  {
    row: D;
  } & Props
>;

type FieldBaseProps = {
  label?: string;
  error?: ReactNode;
  renderBase?: ReactNode;
  hint?: string;
  classes?: {
    label?: string;
    helperText?: string;
    input?: string;
  } & InputProps['classes'];
};
export type FieldProps = InputProps &
  FieldBaseProps & {
    fullWidth?: boolean;
    desc?: string;
  };

export type InputProps = InputBaseProps & {
  trailingIcon?: IconType | ReactNode;
  trailing?: FC<{ className: string }>;
  leadingIcon?: IconType | ReactNode;
  leading?: FC<{ className: string }>;
  classes?: {
    inputContainer?: string;
    trailingIcon?: string;
    trailingIconContainer?: string;
    leadingIcon?: string;
    leadingIconContainer?: string;
    leading?: string;
    trailing?: string;
    inputBase?: string;
  };
  children?: FC<HTMLProps<HTMLInputElement>>;
};

export type InputBaseProps = HTMLProps<HTMLInputElement> & {
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
};

export interface ConfirmButtonProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  as?: keyof JSX.IntrinsicElements;
  onConfirm?: OptionalBooleanFunction;
  onDismiss?: OptionalBooleanFunction;
  dialogTitle?: ReactNode;
  dialogDesc?: ReactNode;
  confirmLabel?: ReactNode;
  dismissLabel?: ReactNode;
  hideIcon?: boolean;
  icon?: IconType;
  loading?: boolean;
}

export interface ConfirmModalProps {
  onConfirm?: OptionalBooleanFunction;
  onDismiss?: OptionalBooleanFunction;
  open?: boolean;
  onClose: (value: boolean) => void;
  dialogTitle?: ReactNode;
  dialogDesc?: ReactNode;
  confirmLabel?: ReactNode;
  dismissLabel?: ReactNode;
  hideIcon?: boolean;
  icon?: IconType;
  loading?: boolean;
}

export interface LayoutProps {
  current: NavigationPage;
}
