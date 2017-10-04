// @flow

export type Args = Array<string>;

export type Flags = {
  [key: string]: string | boolean,
};

export type JSONValue =
  | null
  | string
  | boolean
  | number
  | Array<JSONValue>
  | { [key: string]: JSONValue };

export type Package = {
  dir: string,
  name: string,
  config: JSONValue,
};

export type Project = {
  dir: string,
  name: string,
  config: JSONValue,
};
