import {FC, ReactNode} from "react";

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
