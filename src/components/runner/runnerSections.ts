import type { AnyRoute } from "@tanstack/react-router"

import { Route as AboutRoute } from "#/routes/_viewer/$runnerId/about.tsx"
import { Route as ComplexFormsRoute } from "#/routes/_viewer/$runnerId/complex-forms.tsx"
import { Route as ContactsRoute } from "#/routes/_viewer/$runnerId/contacts.tsx"
import { Route as DefenseRoute } from "#/routes/_viewer/$runnerId/defense.tsx"
import { Route as DronesRoute } from "#/routes/_viewer/$runnerId/drones.tsx"
import { Route as FinancesRoute } from "#/routes/_viewer/$runnerId/finances.tsx"
import { Route as GearRoute } from "#/routes/_viewer/$runnerId/gear.tsx"
import { Route as LicensesRoute } from "#/routes/_viewer/$runnerId/licenses.tsx"
import { Route as MatrixRoute } from "#/routes/_viewer/$runnerId/matrix.tsx"
import { Route as NotesRoute } from "#/routes/_viewer/$runnerId/notes.tsx"
import { Route as OffenseRoute } from "#/routes/_viewer/$runnerId/offense.tsx"
import { Route as AdeptPowersRoute } from "#/routes/_viewer/$runnerId/powers.tsx"
import { Route as SkillsRoute } from "#/routes/_viewer/$runnerId/skills.tsx"
import { Route as SpellsRoute } from "#/routes/_viewer/$runnerId/spells.tsx"
import { Route as SpiritsRoute } from "#/routes/_viewer/$runnerId/spirits.tsx"
import { Route as SpritesRoute } from "#/routes/_viewer/$runnerId/sprites.tsx"
import { Route as VehiclesRoute } from "#/routes/_viewer/$runnerId/vehicles.tsx"
import { AwakeningType } from "#/system/awakeningType.ts"

enum SectionKey {
  about = "about",
  licenses = "licenses",
  defense = "defense",
  offense = "offense",
  matrix = "matrix",
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
  readonly id: RunnerSectionKey
  readonly label: string
  readonly route: AnyRoute
  readonly visibleFor?: AwakeningType[]
}

export type RunnerSectionKey = SectionKey
export type RunnerSection = SectionInfo

export const runnerSections: Readonly<Record<SectionKey, SectionInfo>> = {
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
  [SectionKey.matrix]: {
    id: SectionKey.matrix,
    label: "Matrix",
    route: MatrixRoute,
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

export const runnerSectionOrder = Object.values(runnerSections)
