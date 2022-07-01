import { Role } from 'constants/role';
import type {
  NextPageContext,
  CustomNextComponentType,
  NextComponentType,
} from 'next';
import { Router } from 'next/router';
import { AppPropsType, BaseContext } from 'next/dist/shared/lib/utils';
import { ReactNode } from 'react';

export type AuthWallConfig = {
  roles?: Role[];
  loadingLayout?: ReactNode;
  unauthorizedLayout?: ReactNode;
  unauthorized?: string; // redirect
};

interface ComponentProps {
  auth?: AuthWallConfig;
  layout?: AuthWallConfig;
}

declare module 'next' {
  type CustomNextComponentType<
    C extends BaseContext = NextPageContext,
    IP = {},
    P = {}
  > = NextComponentType<C, IP, P> & ComponentProps;

  type NextPage<P = {}, IP = P> = CustomNextComponentType<
    NextPageContext,
    IP,
    P
  >;
}

declare module 'next/app' {
  type AppProps<P = {}> = AppPropsType<Router, P> & {
    Component: CustomNextComponentType;
  };
}
