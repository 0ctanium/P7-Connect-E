import {FC, HTMLProps, ReactNode} from "react";
import {IconType} from "react-icons";

export interface TooltipProps {
  render: ReactNode;
  show?: boolean;
  className?: string;
}

export type CellComponent<
    D extends Record<string, any> = Record<string, unknown>,
    Props extends Record<string, any> = Record<string, unknown>,
    > = FC<{
      row: D
    } & Props>;


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
export type FieldProps = InputProps & FieldBaseProps & {
  fullWidth?: boolean
  desc?: string
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
