import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { AttackModifierChecklist } from "#/components/entities/items/attackCalculator/attackModifierChecklist.tsx"
import { AttackTestResolution } from "#/components/entities/items/attackCalculator/attackTestResolution.tsx"
import {
  meleeAttackModifiers,
  rangedAttackModifiers,
} from "#/components/entities/items/attackCalculator/weaponAttackCalculatorData.ts"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { Label } from "#/components/ui/text/label.tsx"

import { GmCounterField } from "./gmCounterField.tsx"
import { buildGmDicePool } from "./gmDicePool.ts"
import { GmToggleButtons } from "./gmToggleButtons.tsx"

type GmAttackType = "melee" | "ranged"

/**
 * Runner-free Attack Calculator for the GM Screen: the GM enters the attacker's attribute and
 * skill dice by hand, picks situational modifiers, and resolves the Attack Test against the
 * defender's hits.
 */
export const GmAttackCalculatorPanel: FC = () => {
  const [attackType, setAttackType] = useState<GmAttackType>("ranged")
  const [attributeDice, setAttributeDice] = useState(3)
  const [skillDice, setSkillDice] = useState(3)
  const [woundMod, setWoundMod] = useState(0)
  const [damageValue, setDamageValue] = useState("5P")
  const [modifierValues, setModifierValues] = useState<Record<string, number>>({})

  const modifiers = attackType === "melee" ? meleeAttackModifiers : rangedAttackModifiers

  const attackPool = buildGmDicePool({
    id: "gm-attack-test",
    label: "Attack Test",
    woundMod,
    groups: [
      { id: "attribute", name: "Attribute", size: attributeDice, type: "attribute" },
      { id: "skill", name: "Combat Skill", size: skillDice, type: "skill" },
      ...Object.entries(modifierValues).map(([label, value]) => ({ id: label, name: label, size: value })),
    ],
  })

  return (
    <Stack sx={{ gap: 1.5 }}>
      <GmToggleButtons
        label="Attack Type"
        value={attackType}
        options={[
          { value: "melee", label: "Melee" },
          { value: "ranged", label: "Ranged" },
        ]}
        onChange={(value) => {
          setAttackType(value)
          // The two modifier tables share some labels (e.g. "Called Shot") with different rules,
          // so carrying selections across would silently apply the wrong table's values.
          setModifierValues({})
        }}
      />

      <Stack sx={{ gap: 0.5 }}>
        <Label label="Attacker" />
        <GmCounterField label="Attribute (usually Agility)" value={attributeDice} onChange={setAttributeDice} />
        <GmCounterField label="Combat Skill" value={skillDice} onChange={setSkillDice} />
        <GmCounterField label="Wound Modifier" value={woundMod} onChange={setWoundMod} />
        <TextField
          label="Damage Value"
          value={damageValue}
          onChange={(event) => setDamageValue(event.target.value)}
          size="small"
          sx={{ marginTop: 1 }}
        />
      </Stack>

      <Stack sx={{ gap: 0.5 }}>
        <Label label={attackType === "melee" ? "Melee Modifiers" : "Ranged Modifiers"} />
        <AttackModifierChecklist
          modifiers={modifiers}
          values={modifierValues}
          onChange={(label, appliedValue) => setModifierValues((previous) => ({ ...previous, [label]: appliedValue }))}
        />
      </Stack>

      <Divider />

      <DicePool pool={attackPool} />

      <AttackTestResolution poolSize={attackPool.size} damageValue={damageValue} />
    </Stack>
  )
}
