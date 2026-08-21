/**
 * Discriminates every `EntityData`-conforming type, including `RunnerData`. See CONTEXT.md's
 * **Entity** glossary entry. `itemType`/`spiritType`/etc. remain each kind's own second-level
 * discriminant nested under `kind` — e.g. every Vehicle, Weapon, or Armor is `kind: "item"` with
 * `itemType` distinguishing them further.
 */
export enum EntityKind {
  runner = "runner",
  item = "item",
  spirit = "spirit",
  sprite = "sprite",
  matrixNode = "matrixNode",
  quality = "quality",
  spell = "spell",
  complexForm = "complexForm",
  adeptPower = "adeptPower",
}
