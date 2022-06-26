export type OptionalBooleanFunction = () =>
  | Promise<void | boolean>
  | Promise<void>
  | Promise<boolean>
  | void
  | boolean;
