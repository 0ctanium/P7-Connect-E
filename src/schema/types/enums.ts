import { Role as RolesEnum } from 'constants/role';
import { enumType } from 'nexus';

export const Role = enumType({
  name: 'Role',
  members: Object.values(RolesEnum),
});

export const CursorDirection = enumType({
  name: 'CursorDirection',
  members: ['after', 'before'],
});
