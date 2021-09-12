export type AttrType = string
export type AttrValue = number | string | null | undefined

export interface AttrList {
  [type: string]: AttrValue
}

export type AttrNames = {
  [type: string]: string
}
