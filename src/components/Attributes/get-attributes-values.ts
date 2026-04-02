import { createAttrInfo } from "#/components/Attributes/attribute-info.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { AwakeningData } from "#/lib/system/awakening-type.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"
import type { MetatypeData } from "#/lib/system/metatype-data.ts"

export const getAttributesValues = (
  metatype: MetatypeData,
  awakening: AwakeningData,
  values?: CharacterSheet["attributes"],
): CharacterSheet["attributes"] => {
  return {
    body: createAttrInfo({
      attr: AttributeKey.body,
      value: values?.body,
      metatype,
      awakening,
    }).value,

    agility: createAttrInfo({
      attr: AttributeKey.agility,
      value: values?.agility,
      metatype,
      awakening,
    }).value,

    reaction: createAttrInfo({
      attr: AttributeKey.reaction,
      value: values?.reaction,
      metatype,
      awakening,
    }).value,

    strength: createAttrInfo({
      attr: AttributeKey.strength,
      value: values?.strength,
      metatype,
      awakening,
    }).value,

    charisma: createAttrInfo({
      attr: AttributeKey.charisma,
      value: values?.charisma,
      metatype,
      awakening,
    }).value,

    intuition: createAttrInfo({
      attr: AttributeKey.intuition,
      value: values?.intuition,
      metatype,
      awakening,
    }).value,

    logic: createAttrInfo({
      attr: AttributeKey.logic,
      value: values?.logic,
      metatype,
      awakening,
    }).value,

    willpower: createAttrInfo({
      attr: AttributeKey.willpower,
      value: values?.willpower,
      metatype,
      awakening,
    }).value,

    edge: createAttrInfo({
      attr: AttributeKey.edge,
      value: values?.edge,
      metatype,
      awakening,
    }).value,

    essence: createAttrInfo({
      attr: AttributeKey.essence,
      value: values?.essence,
      metatype,
      awakening,
    }).value,

    magic: createAttrInfo({
      attr: AttributeKey.magic,
      value: values?.magic,
      metatype,
      awakening,
    }).value,

    resonance: createAttrInfo({
      attr: AttributeKey.resonance,
      value: values?.resonance,
      metatype,
      awakening,
    }).value,
  }
}
