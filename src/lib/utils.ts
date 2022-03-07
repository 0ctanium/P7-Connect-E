export function isPromise(object: any): boolean {
  if(Promise && Promise.resolve){
    return Promise.resolve(object) == object;
  } else {
    throw "Promise not supported in your environment"
  }
}
