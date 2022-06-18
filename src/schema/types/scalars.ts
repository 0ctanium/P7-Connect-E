import {FileUpload} from "graphql-upload";

const {GraphQLEmailAddress} = require('graphql-scalars');
const { GraphQLUpload } = require("graphql-upload")
const { GraphQLDateTime } = require('graphql-iso-date')

import { asNexusMethod } from "nexus"

export type Scalars = Promise<FileUpload>
// Bang is required due to https://github.com/apollographql/apollo-server/blob/570f548b88750a06fbf5f67a4abe78fb0f870ccd/packages/apollo-server-core/src/index.ts#L49-L56
export const Upload = asNexusMethod(GraphQLUpload!, "upload")

// @ts-ignore
export const DateTime = asNexusMethod(GraphQLDateTime, "date")
export const EmailAddress = asNexusMethod(GraphQLEmailAddress, "email")
