import { OptionalBooleanFunction } from 'types';

export function isPromise(object: any): boolean {
  if (Promise && Promise.resolve) {
    return Promise.resolve(object) == object;
  } else {
    throw 'Promise not supported in your environment';
  }
}

export async function checkIfFunctionFalse(
  func?: OptionalBooleanFunction
): Promise<boolean> {
  if (!func) return true;

  const res = func();

  if (res === false) return false;

  if (res instanceof Promise) {
    if ((await res) === false) return false;
  }

  return true;
}
