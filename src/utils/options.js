// @flow

export function string(val: mixed, name: string): string | void {
  if (typeof val !== 'undefined' && typeof val !== 'string') {
    throw new Error(`Flag "${name}" must be string`);
  } else {
    return val;
  }
}

export function boolean(val: mixed, name: string): boolean | void {
  if (typeof val !== 'undefined' && typeof val !== 'boolean') {
    throw new Error(`Flag "${name}" must be boolean`);
  } else {
    return val;
  }
}
