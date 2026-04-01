import type { AttributeKey } from "#/lib/system/attributeKey.ts"

export type GameEffectTarget =
  | string
  | "initative"
  | `attr.${AttributeKey}`
  | `skill.${string}`
  | `spell.${string}`
  | `adeptPower.${string}`
  | `damage.${string}.overflow`
  | `damage.resistance`
  | `damage.soak`
  | `weapon.recoil`
