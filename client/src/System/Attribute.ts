export type AttrType = string;
export type AttrValue = number | string | null

export interface AttrList {
  [type: string]: AttrValue
}

export type AttrNames = {
  [type: string]: string
}
