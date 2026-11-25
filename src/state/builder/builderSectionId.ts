export enum BuilderSectionId {
  profile = "profile",
  biology = "biology",
  reputation = "reputation",
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
  karma = "karma",
  finances = "finances",
}

interface BuilderSectionInfo {
  label: string
}

export const builderSections: Record<BuilderSectionId, BuilderSectionInfo> = {
  [BuilderSectionId.profile]: { label: "Profile" },
  [BuilderSectionId.biology]: { label: "Biology" },
  [BuilderSectionId.reputation]: { label: "Reputation" },
  [BuilderSectionId.attributes]: { label: "Attributes" },
  [BuilderSectionId.qualities]: { label: "Qualities" },
  [BuilderSectionId.activeSkills]: { label: "Active Skills" },
  [BuilderSectionId.knowledgeSkills]: { label: "Knowledge Skills" },
  [BuilderSectionId.spells]: { label: "Spells" },
  [BuilderSectionId.adeptPowers]: { label: "Powers" },
  [BuilderSectionId.complexForms]: { label: "Complex Forms" },
  [BuilderSectionId.sprites]: { label: "Sprites" },
  [BuilderSectionId.gear]: { label: "Gear" },
  [BuilderSectionId.contacts]: { label: "Contacts" },
  [BuilderSectionId.karma]: { label: "Karma" },
  [BuilderSectionId.finances]: { label: "Finances" },
}

export const builderSectionOrder = Object.values(BuilderSectionId)
