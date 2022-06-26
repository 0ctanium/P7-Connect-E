import {User as IUser} from "generated/graphql";
import {DefaultSession, DefaultUser} from "next-auth";
import {DefaultJWT} from "next-auth/jwt";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

type TUser = Partial<IUser> & Pick<IUser, "id">& Pick<IUser, "role">

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, TUser {}
}

declare module "next-auth" {
  interface User extends DefaultUser, TUser {}

  interface Session extends DefaultSession {
    user: TUser
  }
}
