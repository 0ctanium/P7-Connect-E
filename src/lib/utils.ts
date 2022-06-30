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

export function stringToColour(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }

  return colour;
}
