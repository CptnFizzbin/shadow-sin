import type { AnyRoute } from "@tanstack/react-router"

import { Route as AboutRoute } from "#/routes/$characterId/about.tsx"
import { Route as ComplexFormsRoute } from "#/routes/$characterId/complex-forms.tsx"
import { Route as ContactsRoute } from "#/routes/$characterId/contacts.tsx"
import { Route as DefenseRoute } from "#/routes/$characterId/defense.tsx"
import { Route as DronesRoute } from "#/routes/$characterId/drones.tsx"
import { Route as FinancesRoute } from "#/routes/$characterId/finances.tsx"
import { Route as GearRoute } from "#/routes/$characterId/gear.tsx"
import { Route as LicensesRoute } from "#/routes/$characterId/licenses.tsx"
import { Route as NotesRoute } from "#/routes/$characterId/notes.tsx"
import { Route as OffenseRoute } from "#/routes/$characterId/offense.tsx"
import { Route as AdeptPowersRoute } from "#/routes/$characterId/powers.tsx"
import { Route as SkillsRoute } from "#/routes/$characterId/skills.tsx"
import { Route as SpellsRoute } from "#/routes/$characterId/spells.tsx"
import { Route as SpiritsRoute } from "#/routes/$characterId/spirits.tsx"
import { Route as SpritesRoute } from "#/routes/$characterId/sprites.tsx"
import { Route as VehiclesRoute } from "#/routes/$characterId/vehicles.tsx"
import { AwakeningType } from "#/system/awakeningType.ts"

enum SectionKey {
  about = "about",
  licenses = "licenses",
  defense = "defense",
  offense = "offense",
  gear = "gear",
  skills = "skills",
  spells = "spells",
  adeptPowers = "adeptPowers",
  spirits = "spirits",
  complexForms = "complexForms",
  sprites = "sprites",
  drones = "drones",
  vehicles = "vehicles",
  contacts = "contacts",
  finances = "finances",
  notes = "notes",
}

export interface SectionInfo {
  readonly id: CharacterSectionKey
  readonly label: string
  readonly route: AnyRoute
  readonly visibleFor?: AwakeningType[]
}

export type CharacterSectionKey = SectionKey
export type CharacterSection = SectionInfo

export const characterSections: Readonly<Record<SectionKey, SectionInfo>> = {
  [SectionKey.about]: {
    id: SectionKey.about,
    label: "About",
    route: AboutRoute,
  },
  [SectionKey.licenses]: {
    id: SectionKey.licenses,
    label: "Licenses",
    route: LicensesRoute,
  },
  [SectionKey.defense]: {
    id: SectionKey.defense,
    label: "Defense",
    route: DefenseRoute,
  },
  [SectionKey.offense]: {
    id: SectionKey.offense,
    label: "Offense",
    route: OffenseRoute,
  },
  [SectionKey.gear]: {
    id: SectionKey.gear,
    label: "Gear",
    route: GearRoute,
  },
  [SectionKey.skills]: {
    id: SectionKey.skills,
    label: "Skills",
    route: SkillsRoute,
  },
  [SectionKey.spells]: {
    id: SectionKey.spells,
    label: "Spells",
    route: SpellsRoute,
    visibleFor: [AwakeningType.Magician, AwakeningType.MysticAdept],
  },
  [SectionKey.adeptPowers]: {
    id: SectionKey.adeptPowers,
    label: "Powers",
    route: AdeptPowersRoute,
    visibleFor: [AwakeningType.Adept, AwakeningType.MysticAdept],
  },
  [SectionKey.spirits]: {
    id: SectionKey.spirits,
    label: "Spirits",
    route: SpiritsRoute,
    visibleFor: [AwakeningType.Magician, AwakeningType.MysticAdept],
  },
  [SectionKey.complexForms]: {
    id: SectionKey.complexForms,
    label: "Complex Forms",
    route: ComplexFormsRoute,
    visibleFor: [AwakeningType.Technomancer],
  },
  [SectionKey.sprites]: {
    id: SectionKey.sprites,
    label: "Sprites",
    route: SpritesRoute,
    visibleFor: [AwakeningType.Technomancer],
  },
  [SectionKey.vehicles]: {
    id: SectionKey.vehicles,
    label: "Vehicles",
    route: VehiclesRoute,
  },
  [SectionKey.drones]: {
    id: SectionKey.drones,
    label: "Drones",
    route: DronesRoute,
  },
  [SectionKey.contacts]: {
    id: SectionKey.contacts,
    label: "Contacts",
    route: ContactsRoute,
  },
  [SectionKey.finances]: {
    id: SectionKey.finances,
    label: "Finances",
    route: FinancesRoute,
  },
  [SectionKey.notes]: {
    id: SectionKey.notes,
    label: "Notes",
    route: NotesRoute,
  },
}

export const characterSectionOrder = Object.values(characterSections)
