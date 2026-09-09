import type { AttributeInfo, EntityAttributeInfo } from "#/system/attributeInfo.ts"
import type { AttrKey } from "#/system/attributeKey.ts"

export type AttributeCatalog = Partial<Record<AttrKey, number>>

export type AttributeInfoCatalog = Partial<Record<AttrKey, AttributeInfo>>

export type EntityAttributeCatalog = Partial<Record<AttrKey, EntityAttributeInfo>>

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

export const createAttrInfoCatalog = (data: Partial<Record<AttrKey, Omit<AttributeInfo, "attr">>>): AttributeInfoCatalog => {
  return Object.fromEntries(
    Object.entries(data)
      .map(([attr, info]) => [attr, { ...info, attr }]),
  )
}
