import type { AnyRoute } from "@tanstack/react-router"

import { Route as ContactsRoute } from "#/routes/gm/contacts.tsx"
import { Route as EncounterBuilderRoute } from "#/routes/gm/encounter-builder.tsx"
import { Route as InitiativeTrackerRoute } from "#/routes/gm/initiative-tracker.tsx"
import { Route as NpcBuilderRoute } from "#/routes/gm/npc-builder.tsx"

enum GmToolKey {
  initiativeTracker = "initiativeTracker",
  encounterBuilder = "encounterBuilder",
  npcBuilder = "npcBuilder",
  contacts = "contacts",
}

export interface GmToolInfo {
  readonly id: GmToolKey
  readonly label: string
  readonly description: string
  readonly route: AnyRoute
  readonly underConstruction: boolean
}

const gmTools: Readonly<Record<GmToolKey, GmToolInfo>> = {
  [GmToolKey.initiativeTracker]: {
    id: GmToolKey.initiativeTracker,
    label: "Initiative Tracker",
    description: "Track turn order and initiative scores during combat.",
    route: InitiativeTrackerRoute,
    underConstruction: true,
  },
  [GmToolKey.encounterBuilder]: {
    id: GmToolKey.encounterBuilder,
    label: "Encounter Builder",
    description: "Assemble and balance encounters ahead of a run.",
    route: EncounterBuilderRoute,
    underConstruction: true,
  },
  [GmToolKey.npcBuilder]: {
    id: GmToolKey.npcBuilder,
    label: "NPC Builder",
    description: "Quickly stat out NPCs with a simplified character creator.",
    route: NpcBuilderRoute,
    underConstruction: true,
  },
  [GmToolKey.contacts]: {
    id: GmToolKey.contacts,
    label: "Contacts",
    description: "Create contacts and export them as data packets for players to import.",
    route: ContactsRoute,
    underConstruction: false,
  },
}

export const gmToolOrder = Object.values(gmTools)
