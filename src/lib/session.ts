import { Session } from "next-auth";
import { Role } from "constants/role";

export const checkSessionAuthenticated  = (session: Session | null): boolean => Boolean(session)
export const checkSessionRole  = (session: Session | null, role: Role): boolean => session?.user.role === role
