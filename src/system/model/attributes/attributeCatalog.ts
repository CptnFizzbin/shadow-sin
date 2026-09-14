import type { AttributeInfo, EntityAttributeInfo } from "./attributeInfo.ts"
import type { AttrKey } from "./attributeKey.ts"

export type AttributeCatalog = Partial<Record<AttrKey, number>>

export type AttributeInfoCatalog = Partial<Record<AttrKey, AttributeInfo>>

export type EntityAttributeCatalog = Partial<Record<AttrKey, EntityAttributeInfo>>

export const createAttrInfoCatalog = (data: Partial<Record<AttrKey, Omit<AttributeInfo, "attr">>>): AttributeInfoCatalog => {
  return Object.fromEntries(
    Object.entries(data)
      .map(([attr, info]) => [attr, { ...info, attr }]),
  )
}
