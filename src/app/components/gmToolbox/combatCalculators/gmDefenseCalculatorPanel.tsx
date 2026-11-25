import Alert from "@mui/material/Alert"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { DefenseAttackType } from "#/components/entities/items/defenseCalculator/defenseCalculatorData.ts"
import { defenseModifiersForAttackType } from "#/components/entities/items/defenseCalculator/defenseCalculatorData.ts"
import { DefenseModifierList } from "#/components/entities/items/defenseCalculator/defenseModifierList.tsx"
import {
  defenseModifierGroups,
  emptyDefenseModifierSelection,
} from "#/components/entities/items/defenseCalculator/defenseModifierSelection.ts"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { Label } from "#/components/ui/text/label.tsx"

import { GmCounterField } from "./gmCounterField.tsx"
import { buildGmDicePool } from "./gmDicePool.ts"
import { GmToggleButtons } from "./gmToggleButtons.tsx"

type SpellType = "direct" | "indirect"
type SpellDamageType = "physical" | "mana"

const defenseSkillLabels: Record<DefenseAttackType, string> = {
  melee: "Defense Skill (Dodge, Parry, Block)",
  ranged: "Dodge",
  spell: "Counterspelling",
}

/**
 * Runner-free Defense Calculator for the GM Screen: the GM enters the defender's dice by hand,
 * picks situational modifiers, and gets the Defense Test and Damage Resistance Test pools.
 */
export const GmDefenseCalculatorPanel: FC = () => {
  const [attackType, setAttackType] = useState<DefenseAttackType>("ranged")
  const [spellType, setSpellType] = useState<SpellType>("direct")
  const [spellDamageType, setSpellDamageType] = useState<SpellDamageType>("physical")
  const [attributeDice, setAttributeDice] = useState(3)
  const [skillDice, setSkillDice] = useState(0)
  const [fullDefense, setFullDefense] = useState(false)
  const [fullDefenseDice, setFullDefenseDice] = useState(0)
  const [woundMod, setWoundMod] = useState(0)
  const [unaware, setUnaware] = useState(false)
  const [modifierSelection, setModifierSelection] = useState(emptyDefenseModifierSelection)
  const [bodyDice, setBodyDice] = useState(3)
  const [armorRating, setArmorRating] = useState(0)

  const isSpell = attackType === "spell"
  const isDirectSpell = isSpell && spellType === "direct"
  const modifiers = defenseModifiersForAttackType(attackType)

  // Direct combat spells are resisted with Body (physical) or Willpower (mana); everything else,
  // indirect spells included, is dodged with Reaction.
  const defenseAttributeLabel = isDirectSpell
    ? (spellDamageType === "physical" ? "Body" : "Willpower")
    : "Reaction"

  const defensePool = buildGmDicePool({
    id: "gm-defense-test",
    label: "Defense Test",
    woundMod,
    groups: [
      { id: "attribute", name: defenseAttributeLabel, size: attributeDice, type: "attribute" },
      { id: "skill", name: defenseSkillLabels[attackType], size: skillDice, type: "skill" },
      ...(fullDefense && !isSpell
        ? [{ id: "full-defense", name: "Full Defense (Dodge)", size: fullDefenseDice, type: "skill" as const }]
        : []),
      ...defenseModifierGroups(modifiers, modifierSelection),
    ],
  })

  // Indirect spells are resisted with Body + half Impact armor, rounded down.
  const effectiveArmor = isSpell ? Math.floor(armorRating / 2) : armorRating

  const resistPool = isDirectSpell
    ? { ...defensePool, id: "gm-resist-test", label: "Damage Resistance Test" }
    : buildGmDicePool({
        id: "gm-resist-test",
        label: "Damage Resistance Test",
        groups: [
          { id: "body", name: "Body", size: bodyDice, type: "attribute" },
          { id: "armor", name: isSpell ? "Impact Armor (half)" : "Armor", size: effectiveArmor, type: "bonus" },
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
          { value: "spell", label: "Spell" },
        ]}
        onChange={(value) => {
          setAttackType(value)
          // Modifier ids are shared across attack types, but each type offers a different subset.
          setModifierSelection(emptyDefenseModifierSelection)
        }}
      />

      {isSpell && (
        <GmToggleButtons
          label="Spell Type"
          value={spellType}
          options={[
            { value: "direct", label: "Direct" },
            { value: "indirect", label: "Indirect" },
          ]}
          onChange={setSpellType}
        />
      )}

      {isDirectSpell && (
        <GmToggleButtons
          label="Damage Type"
          value={spellDamageType}
          options={[
            { value: "physical", label: "Physical (Body)" },
            { value: "mana", label: "Mana (Willpower)" },
          ]}
          onChange={setSpellDamageType}
        />
      )}

      <Stack sx={{ gap: 0.5 }}>
        <Label label="Defender" />
        <GmCounterField label={defenseAttributeLabel} value={attributeDice} onChange={setAttributeDice} />
        <GmCounterField label={defenseSkillLabels[attackType]} value={skillDice} onChange={setSkillDice} />
        <GmCounterField label="Wound Modifier" value={woundMod} onChange={setWoundMod} />

        {!isSpell && (
          <FormControlLabel
            control={(
              <Checkbox checked={fullDefense} onChange={(event) => setFullDefense(event.target.checked)} />
            )}
            label="Full Defense (consumes next action phase)"
          />
        )}
        {!isSpell && fullDefense && (
          <GmCounterField label="Dodge (Full Defense)" value={fullDefenseDice} onChange={setFullDefenseDice} />
        )}
      </Stack>

      <Stack>
        <Label label="Modifiers" />
        <Typography variant="caption" color="text.secondary">
          Worded from the defender's point of view.
        </Typography>

        <FormControlLabel
          control={(
            <Checkbox checked={unaware} onChange={(event) => setUnaware(event.target.checked)} color="error" />
          )}
          label="Unaware of the attack (no defense possible)"
        />

        <DefenseModifierList
          modifiers={modifiers}
          selection={modifierSelection}
          onChange={setModifierSelection}
          disabled={unaware}
        />
      </Stack>

      <Divider />

      {unaware
        ? <Alert severity="warning">No defense is possible — the defender is unaware of the attack.</Alert>
        : <DicePool pool={defensePool} />}

      <Divider />

      <Stack sx={{ gap: 0.5 }}>
        <Label label="Resist Damage" />

        {isDirectSpell
          ? (
              <Alert severity="info">
                Direct combat spells use the Defense Test to resist damage too — no separate test.
              </Alert>
            )
          : (
              <>
                <GmCounterField label="Body" value={bodyDice} onChange={setBodyDice} />
                <GmCounterField
                  label={isSpell ? "Impact Armor" : "Armor (Ballistic or Impact)"}
                  value={armorRating}
                  onChange={setArmorRating}
                />
              </>
            )}
      </Stack>

      <DicePool pool={resistPool} />
    </Stack>
  )
}
