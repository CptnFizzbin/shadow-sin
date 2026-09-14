export type GearSubmitAction = "acquire" | "purchase" | "save"

export type GearSubmitMeta = {
  submitAction: GearSubmitAction
}

export const defaultGearSubmitMeta: GearSubmitMeta = { submitAction: "save" }
