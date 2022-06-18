import "next-auth/jwt"
import {DefaultSession} from "next-auth";
import { Role } from 'constants'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation


declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id?: string | null;
    /** The user's role group. */
    role: Role
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id?: string | null;
      /** The user's role group. */
      role: Role
    } & DefaultSession["user"]
  }
}
