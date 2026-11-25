import type { AttributeCatalog, AttributeInfoCatalog } from "#/system/model/attributes/attributeCatalog.ts"
import type { AttrKey } from "#/system/model/attributes/attributeKey.ts"

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
