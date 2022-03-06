import { withAuth } from "next-auth/middleware"
import {Roles} from "../../src/constants";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role !== Roles.USER,
  },
})
