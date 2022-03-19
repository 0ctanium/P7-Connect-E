import { GroupPrivacy as GroupPrivacyEnum } from '@prisma/client'
import { Role as RolesEnum } from 'constants/role'
import {enumType} from "nexus";

export const Role = enumType({
  name: 'Role',
  members: Object.values(RolesEnum)
})

export const GroupPrivacy = enumType({
  name: 'GroupPrivacy',
  members: Object.values(GroupPrivacyEnum)
})
