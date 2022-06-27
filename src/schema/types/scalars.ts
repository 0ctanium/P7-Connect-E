const {
  EmailAddressResolver,
  DateTimeResolver,
  JSONResolver,
  JSONObjectResolver,
} = require('graphql-scalars');
const { GraphQLUpload } = require('graphql-upload');

import { asNexusMethod } from 'nexus';

// Bang is required due to https://github.com/apollographql/apollo-server/blob/570f548b88750a06fbf5f67a4abe78fb0f870ccd/packages/apollo-server-core/src/index.ts#L49-L56
export const Upload = asNexusMethod(GraphQLUpload!, 'upload');

// @ts-ignore
export const DateTime = asNexusMethod(DateTimeResolver, 'DateTime');
export const EmailAddress = asNexusMethod(EmailAddressResolver, 'EmailAddress');
export const JSON = asNexusMethod(JSONResolver, 'JSON');
export const JSONObject = asNexusMethod(JSONObjectResolver, 'JSONObject');
