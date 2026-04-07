import type { AnyRoute } from "@tanstack/react-router"

import { Route as AboutRoute } from "#/routes/$characterId/about.tsx"
import { Route as ContactsRoute } from "#/routes/$characterId/contacts.tsx"
import { Route as DefenseRoute } from "#/routes/$characterId/defense.tsx"
import { Route as DronesRoute } from "#/routes/$characterId/drones.tsx"
import { Route as FinancesRoute } from "#/routes/$characterId/finances.tsx"
import { Route as GearRoute } from "#/routes/$characterId/gear.tsx"
import { Route as NotesRoute } from "#/routes/$characterId/notes.tsx"
import { Route as OffenseRoute } from "#/routes/$characterId/offense.tsx"
import { Route as QualitiesRoute } from "#/routes/$characterId/qualities.tsx"
import { Route as SkillsRoute } from "#/routes/$characterId/skills.tsx"
import { Route as SpellsRoute } from "#/routes/$characterId/spells.tsx"
import { Route as VehiclesRoute } from "#/routes/$characterId/vehicles.tsx"

export enum SectionKey {
  about = "about",
  defense = "defense",
  offense = "offense",
  gear = "gear",
  skills = "skills",
  spells = "spells",
  drones = "drones",
  vehicles = "vehicles",
  contacts = "contacts",
  qualities = "qualities",
  finances = "finances",
  notes = "notes",
}

export interface SectionInfo {
  readonly id: CharacterSectionKey
  readonly label: string
  readonly route: AnyRoute
}

export type CharacterSectionKey = SectionKey
export type CharacterSection = SectionInfo

export const characterSections: Readonly<Record<SectionKey, SectionInfo>> = {
  [SectionKey.about]: {
    id: SectionKey.about,
    label: "About",
    route: AboutRoute,
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
  },
  [SectionKey.drones]: {
    id: SectionKey.drones,
    label: "Drones",
    route: DronesRoute,
  },
  [SectionKey.vehicles]: {
    id: SectionKey.vehicles,
    label: "Vehicles",
    route: VehiclesRoute,
  },
  [SectionKey.contacts]: {
    id: SectionKey.contacts,
    label: "Contacts",
    route: ContactsRoute,
  },
  [SectionKey.qualities]: {
    id: SectionKey.qualities,
    label: "Qualities",
    route: QualitiesRoute,
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
