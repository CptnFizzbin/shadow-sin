import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useGearByType } from "#/components/items/gearHooks.ts"
import {
  defenseModifiers,
  meleeAttackModifiers,
  sumModifiers,
} from "#/components/items/types/weapons/attackCalculator/attackModifierData.ts"
import { ModifiersSection } from "#/components/items/types/weapons/attackCalculator/modifiersSection.tsx"
import { ResultSection } from "#/components/items/types/weapons/attackCalculator/resultSection.tsx"
import { SkillSelectSection } from "#/components/items/types/weapons/attackCalculator/skillSelectSection.tsx"
import type { WeaponAttackCalculatorStep } from "#/components/items/types/weapons/attackCalculator/weaponAttackCalculatorTypes.ts"
import { weaponAttackCalculatorSteps } from "#/components/items/types/weapons/attackCalculator/weaponAttackCalculatorTypes.ts"
import { WeaponAttackHubList } from "#/components/items/types/weapons/attackCalculator/weaponAttackHubList.tsx"
import { WeaponSelectSection } from "#/components/items/types/weapons/attackCalculator/weaponSelectSection.tsx"
import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import { useActiveSkillDicePool } from "#/components/runner/skills/skillDicePools.ts"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import { useEncumbranceDiceGroup } from "#/components/system/dicePool/useDiceGroup.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

interface WeaponAttackDialogProps extends ControlledDialogProps<void> {
  weapon: WeaponData
}

const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({ ctrl, weapon }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))

  const equippedWeapons = useGearByType<WeaponData>(ItemType.weapon)
    .filter((item) => !item.parentId && item.equipped)
  const availableWeapons = equippedWeapons.some((item) => item.id === weapon.id)
    ? equippedWeapons
    : [weapon, ...equippedWeapons]

  // null = the hub (step list); a step = that step is drilled into.
  const [activeStep, setActiveStep] = useState<WeaponAttackCalculatorStep | null>(null)
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(weapon.id)
  const [selectedSkill, setSelectedSkill] = useState<SkillKey>(weapon.skill)
  const [selectedFiremode, setSelectedFiremode] = useState<string | null>(null)
  const [attackModValues, setAttackModValues] = useState<Record<string, number>>({})
  const [defenseModValues, setDefenseModValues] = useState<Record<string, number>>({})

  const selectedWeapon = availableWeapons.find((item) => item.id === selectedWeaponId) ?? weapon
  const isMelee = selectedWeapon.weaponType === WeaponType.melee

  const handleSelectWeapon = (id: string) => {
    setSelectedWeaponId(id)
    const nextWeapon = availableWeapons.find((item) => item.id === id)
    if (nextWeapon) setSelectedSkill(nextWeapon.skill)
    setSelectedFiremode(null)
  }

  const attrKey = selectedWeapon.attribute ?? skillList[selectedSkill].attr
  const affectedByEncumbrance = attrKey === AttributeKey.agility || attrKey === AttributeKey.reaction

  const skillPool = useActiveSkillDicePool({ skillKey: selectedSkill, attrOverride: selectedWeapon.attribute })
  const encumbranceGroup = useEncumbranceDiceGroup()
  const skillRating = useActiveSkillRating(selectedSkill)

  const attackModifierTotal = isMelee ? sumModifiers(meleeAttackModifiers, attackModValues) : 0
  const defenseModifierTotal = sumModifiers(defenseModifiers, defenseModValues)

  const poolGroups = [
    skillPool.groups,
    affectedByEncumbrance ? encumbranceGroup : null,
    attackModifierTotal !== 0
      ? {
          name: "Modifiers",
          size: attackModifierTotal,
          color: attackModifierTotal > 0 ? "success.main" : "error.main",
        }
      : null,
  ]
  const poolTotal = getPoolSize(poolGroups.flat())

  const goToHub = () => setActiveStep(null)
  const activeStepInfo = weaponAttackCalculatorSteps.find((info) => info.step === activeStep) ?? null

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClosed={goToHub}>
      <Dialog.Title>
        {activeStepInfo
          ? (
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <IconButton aria-label="Back to attack calculator" onClick={goToHub}>
                  <RiArrowLeftLine size={20} />
                </IconButton>
                <Box sx={{ flex: 1 }}>{activeStepInfo.label}</Box>
                {/* Spacer mirrors the back button so the title stays centered. */}
                <Box sx={{ width: 36 }} />
              </Stack>
            )
          : selectedWeapon.name}
      </Dialog.Title>

      <Dialog.Content dividers>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {activeStep === null && (
            <WeaponAttackHubList
              weaponName={selectedWeapon.name}
              skill={selectedSkill}
              skillRating={skillRating}
              attackModifierTotal={attackModifierTotal}
              defenseModifierTotal={defenseModifierTotal}
              poolTotal={poolTotal}
              onSelectStep={setActiveStep}
            />
          )}

          {activeStep === "weapon" && (
            <WeaponSelectSection
              weapons={availableWeapons}
              selectedWeapon={selectedWeapon}
              onSelectWeapon={handleSelectWeapon}
              selectedFiremode={selectedFiremode}
              onSelectFiremode={setSelectedFiremode}
            />
          )}

          {activeStep === "skill" && (
            <SkillSelectSection
              weapon={selectedWeapon}
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
            />
          )}

          {activeStep === "modifiers" && (
            <ModifiersSection
              isMelee={isMelee}
              attackValues={attackModValues}
              onAttackChange={(key, points) =>
                setAttackModValues((prev) => ({ ...prev, [key]: points }))}
              defenseValues={defenseModValues}
              onDefenseChange={(key, points) =>
                setDefenseModValues((prev) => ({ ...prev, [key]: points }))}
            />
          )}

          {activeStep === "result" && (
            <ResultSection weapon={selectedWeapon} groups={poolGroups} poolTotal={poolTotal} />
          )}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()} color="secondary" size="small">
          Close
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseWeaponAttackDialogProps = Omit<WeaponAttackDialogProps, keyof ControlledDialogProps<void>>

export const useWeaponAttackDialog = () => useDialog<void, UseWeaponAttackDialogProps>(
  (ctrl, props) => <WeaponAttackDialog ctrl={ctrl} {...props} />,
)
