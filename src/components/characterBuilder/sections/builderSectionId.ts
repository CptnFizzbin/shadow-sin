export enum BuilderSectionId {
  profile = "profile",
  biology = "biology",
  attributes = "attributes",
  qualities = "qualities",
  activeSkills = "active-skills",
  knowledgeSkills = "knowledge-skills",
  spells = "spells",
  adeptPowers = "adeptPowers",
  complexForms = "complexForms",
  sprites = "sprites",
  gear = "gear",
  contacts = "contacts",
}

export interface BuilderSectionInfo {
  label: string
}

export const builderSections: Record<BuilderSectionId, BuilderSectionInfo> = {
  [BuilderSectionId.profile]: { label: "Profile" },
  [BuilderSectionId.biology]: { label: "Biology" },
  [BuilderSectionId.attributes]: { label: "Attributes" },
  [BuilderSectionId.qualities]: { label: "Qualities" },
  [BuilderSectionId.activeSkills]: { label: "Active Skills" },
  [BuilderSectionId.knowledgeSkills]: { label: "Knowledge Skills" },
  [BuilderSectionId.spells]: { label: "Spells" },
  [BuilderSectionId.adeptPowers]: { label: "Adept Powers" },
  [BuilderSectionId.complexForms]: { label: "Complex Forms" },
  [BuilderSectionId.sprites]: { label: "Sprites" },
  [BuilderSectionId.gear]: { label: "Gear" },
  [BuilderSectionId.contacts]: { label: "Contacts" },
}
