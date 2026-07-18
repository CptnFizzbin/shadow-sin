import type { RemixiconComponentType } from "@remixicon/react"
import { RiFlashlightLine, RiFootprintLine, RiSwordLine, RiTimerFlashLine } from "@remixicon/react"

export type CombatActionCategory = "free" | "simple" | "complex" | "interrupt"

export interface CombatActionData {
  name: string
  category: CombatActionCategory
  description: string
}

export interface CombatActionCategoryInfo {
  category: CombatActionCategory
  label: string
  costHint: string
  color: "success" | "info" | "warning" | "error"
  Icon: RemixiconComponentType
}

export const combatActionCategories: CombatActionCategoryInfo[] = [
  {
    category: "free",
    label: "Free Action",
    costHint: "Unlimited — but each still needs an Action Phase to use",
    color: "success",
    Icon: RiFlashlightLine,
  },
  {
    category: "simple",
    label: "Simple Action",
    costHint: "2 per Action Phase",
    color: "info",
    Icon: RiFootprintLine,
  },
  {
    category: "complex",
    label: "Complex Action",
    costHint: "1 per Action Phase — uses the whole phase",
    color: "warning",
    Icon: RiSwordLine,
  },
  {
    category: "interrupt",
    label: "Interrupt Action",
    costHint: "Costs 1 Edge — acts immediately at Initiative Score −5",
    color: "error",
    Icon: RiTimerFlashLine,
  },
]

export const combatActions: CombatActionData[] = [
  {
    name: "Call a Shot",
    category: "free",
    description:
      "Declare a targeted called shot before your next attack this phase, trading a dice pool penalty for a specific effect (bypass armor, disarm, and so on).",
  },
  {
    name: "Drop Prone",
    category: "free",
    description: "Drop instantly from standing or crouching to lying prone.",
  },
  {
    name: "Drop Object",
    category: "free",
    description: "Release whatever you're currently holding.",
  },
  {
    name: "Gesture / Shout",
    category: "free",
    description: "Trigger a readied spell, signal an ally, or issue a one-word command.",
  },
  {
    name: "Change Linked Device Mode",
    category: "free",
    description: "Flip a weapon's fire-mode selector, toggle a smartlink setting, or make a similar single-step device change.",
  },
  {
    name: "Fire Weapon",
    category: "simple",
    description: "Make one ranged attack in Single Shot or Semi-Automatic mode.",
  },
  {
    name: "Take Aim",
    category: "simple",
    description: "Line up a shot for a cumulative +1 die bonus to your next ranged attack this phase.",
  },
  {
    name: "Get Up",
    category: "simple",
    description: "Move from prone to standing.",
  },
  {
    name: "Reload Weapon",
    category: "simple",
    description: "Swap a magazine, speed-load a cylinder, or chamber fresh ammunition.",
  },
  {
    name: "Draw / Ready Weapon",
    category: "simple",
    description: "Draw a holstered or sheathed weapon, or ready a held item for use.",
  },
  {
    name: "Attack (Melee or Ranged)",
    category: "complex",
    description: "Make a single melee or ranged attack roll against one target.",
  },
  {
    name: "Multiple Attacks",
    category: "complex",
    description: "Split your attack dice pool across several targets, each attack taking a cumulative penalty.",
  },
  {
    name: "Full Auto Burst",
    category: "complex",
    description: "Fire a long automatic burst for a larger dice pool at the cost of ammo and recoil control.",
  },
  {
    name: "Sprint",
    category: "complex",
    description: "Move at your Sprint rate, rolling a Running Test for extra distance covered.",
  },
  {
    name: "Observe in Detail",
    category: "complex",
    description: "Make a Perception Test to closely study a target, object, or scene.",
  },
  {
    name: "Full Defense",
    category: "interrupt",
    description: "Interrupt the attacker's turn to add your Willpower to your defense pool against the triggering attack.",
  },
  {
    name: "Intercept",
    category: "interrupt",
    description: "Act immediately, ahead of your normal Initiative Pass, to respond to a triggering event (block a door, catch a thrown object, and so on).",
  },
]
