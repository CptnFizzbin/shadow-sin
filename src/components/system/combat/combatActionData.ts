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
    costHint: "Unlimited during your Action Phase or later in the pass — but none before your first Action Phase",
    color: "success",
    Icon: RiFlashlightLine,
  },
  {
    category: "simple",
    label: "Simple Action",
    costHint: "Two per Action Phase (or one Complex Action instead), plus a Free Action either way",
    color: "info",
    Icon: RiFootprintLine,
  },
  {
    category: "complex",
    label: "Complex Action",
    costHint: "One per Action Phase, plus a Free Action — no Simple Actions allowed that phase",
    color: "warning",
    Icon: RiSwordLine,
  },
  {
    category: "interrupt",
    label: "Interrupt Action",
    costHint: "Taken before your Action Phase, even ahead of next Combat Turn — but costs your next available action",
    color: "error",
    Icon: RiTimerFlashLine,
  },
]

export const combatActions: CombatActionData[] = [
  {
    name: "Call a Shot",
    category: "free",
    description:
      "Aim for a vulnerable spot on your target, trading a dice pool penalty for a specific effect (bypassing armor, disarming, and so on). Must be followed immediately by a Take Aim, Fire Weapon, Throw Weapon, or Melee/Unarmed Attack.",
  },
  {
    name: "Change Linked Device Mode",
    category: "free",
    description:
      "Activate, deactivate, or switch modes on any device you're linked to neurally or wirelessly — cyberware, a smartgun's fire mode, thermographic vision, a commlink's hidden mode, wireless toggles, and the like.",
  },
  {
    name: "Drop Object",
    category: "free",
    description: "Release whatever you're holding. Holding something in each hand? Drop both as a single Free Action.",
  },
  {
    name: "Drop Prone",
    category: "free",
    description: "Kneel or drop prone at any time, as long as you're not surprised.",
  },
  {
    name: "Eject Smartgun Clip",
    category: "free",
    description: "Mentally command a held, linked smartgun to eject its clip. Loading a fresh one still takes a Simple Action.",
  },
  {
    name: "Gesture",
    category: "free",
    description: "Make a single gesture — a silent hand signal in a combat situation, for instance.",
  },
  {
    name: "Intercept",
    category: "free",
    description: "Intercept an opponent trying to move past you or break away from melee combat.",
  },
  {
    name: "Run",
    category: "free",
    description: "Move faster than your Walking Rate. Running applies dice pool modifiers to other actions taken while moving.",
  },
  {
    name: "Speak/Text Phrase",
    category: "free",
    description:
      "Say one phrase or sentence, or send a short text message over a neural commlink connection. Saying more costs another Free Action per phrase.",
  },
  {
    name: "Change Gun Mode",
    category: "simple",
    description: "Switch a held, ready firearm's firing mode, or a shotgun's choke. A linked smartgun only needs a Free Action for this.",
  },
  {
    name: "Fire Weapon",
    category: "simple",
    description:
      "Fire a ready firearm in single-shot, semi-automatic, or burst-fire mode — single-shot weapons and long bursts can only be fired once per Action Phase. Wielding two weapons lets you fire both for one Simple Action.",
  },
  {
    name: "Insert Clip",
    category: "simple",
    description: "Load a fresh clip into a ready firearm, after the old one's been removed.",
  },
  {
    name: "Observe in Detail",
    category: "simple",
    description: "Make a Perception Test to closely study a target, object, or scene.",
  },
  {
    name: "Pick Up/Put Down Object",
    category: "simple",
    description: "Pick up an object within reach, or set down something you're holding.",
  },
  {
    name: "Quick Draw",
    category: "simple",
    description:
      "Draw a pistol-sized weapon and fire it immediately with a Pistols + Reaction (3) Test — threshold 2 with a quick-draw holster. Fail and the gun clears the holster but can't fire this action; glitch and it's stuck or dropped; critical glitch and it's flung across the room or misfires still holstered. Quick-drawing two pistols at once raises the threshold to 4 (3 with quick-draw holsters), tested separately for each.",
  },
  {
    name: "Ready Weapon",
    category: "simple",
    description:
      "Draw, pick up, or otherwise prepare a weapon for use — a firearm, melee weapon, thrown weapon, bow, or mounted weapon. Small thrown weapons like knives or shuriken can be readied in batches of up to half your Agility (rounded down) per action.",
  },
  {
    name: "Remove Clip",
    category: "simple",
    description: "Remove a clip from a ready firearm. A linked smartgun's wielder can eject the clip instead with a Free Action.",
  },
  {
    name: "Sprint",
    category: "simple",
    description: "Push past your Running rate with a Running Test.",
  },
  {
    name: "Stand Up",
    category: "simple",
    description: "Rise from lying down or prone. If wounded, requires a Body + Willpower (2) Test, with wound modifiers applying.",
  },
  {
    name: "Take Aim",
    category: "simple",
    description:
      "Aim a ready ranged weapon for a cumulative +1 dice pool bonus to your next Attack Test, up to a maximum number of stacked actions equal to half your skill with that weapon (rounded down). Lost the moment you take any other action, even a Free Action. Used to line up a shot with an image magnification system, it neutralizes range modifiers instead of granting the +1.",
  },
  {
    name: "Throw Weapon",
    category: "simple",
    description: "Throw a ready throwing weapon.",
  },
  {
    name: "Use Simple Object",
    category: "simple",
    description: "Operate a simple device or mechanism — push a button, turn a knob, pull a lever, open an unlocked door, use a pill or patch.",
  },
  {
    name: "Fire Automatic Weapon",
    category: "complex",
    description: "Fire a ready firearm in full-auto mode.",
  },
  {
    name: "Fire Mounted or Vehicle Weapon",
    category: "complex",
    description: "Fire a ready mounted or vehicle-mounted weapon.",
  },
  {
    name: "Melee or Unarmed Attack",
    category: "complex",
    description: "Make a melee or unarmed attack, potentially against multiple targets within melee range.",
  },
  {
    name: "Reload Firearm",
    category: "complex",
    description: "Reload a weapon that doesn't use a clip.",
  },
  {
    name: "Use Complex Object",
    category: "complex",
    description: "Operate a complex object — a computer, vehicle, or mechanical tool — such as running a program, giving detailed instructions, or driving.",
  },
  {
    name: "Use Skill",
    category: "complex",
    description: "Use an appropriate skill.",
  },
  {
    name: "Full Defense",
    category: "interrupt",
    description:
      "Dedicate your full attention to avoiding incoming attacks, adding your Willpower to your defense pool against the triggering attack. Can be used as an interrupt — even before your Action Phase, as long as you're not surprised — but it uses up your next available action, even your very first action of the next Combat Turn if none remain this one.",
  },
]
