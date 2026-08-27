import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttrKey } from "#/system/attributeKey.ts"

export type AttributeCatalog = Partial<Record<AttrKey, number>>

export type AttributeInfoCatalog = Partial<Record<AttrKey, AttributeInfo>>

export const attrValue = (catalog: AttributeCatalog, attr: AttrKey) => {
  return catalog[attr] ?? 0
}

export const attrMin = (catalog: AttributeInfoCatalog, attr: AttrKey) => {
  return catalog[attr]?.min ?? 0
}

export const attrMax = (catalog: AttributeInfoCatalog, attr: AttrKey) => {
  return attrAugmentedMax(catalog, attr)
}

export const attrNaturalMax = (catalog: AttributeInfoCatalog, attr: AttrKey) => {
  return catalog[attr]?.max ?? 0
}

export const attrAugmentedMax = (catalog: AttributeInfoCatalog, attr: AttrKey) => {
  return catalog[attr]?.augMax ?? attrNaturalMax(catalog, attr)
}
