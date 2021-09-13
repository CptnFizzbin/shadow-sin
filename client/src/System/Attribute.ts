export type AttrType = string
export type AttrValue = number | string | null | undefined
export type AttrList = Record<AttrType, AttrValue>
export type AttrNames = Record<AttrType, string>

let attributeNames: AttrNames = {}

export const registerAttrNames = (names: AttrNames): void => {
  attributeNames = { ...attributeNames, ...names }
}

export const formatAttr = (type: string): string => {
  return attributeNames[type] || type
}
