import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC, SyntheticEvent } from "react"
import { useMemo, useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { useAllAttrInfos } from "#/components/character/characterUtils.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useSkillsStore } from "#/components/character/skills/useSkillsStore.ts"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { AttributeKey, AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"
import { SkillGroupRatingMax, SkillRatingMax } from "#/system/skills/skillUtils.ts"

import { selectCurrentKarma } from "./karmaSelectors.ts"
import { useKarmaStore } from "./useKarmaStore.ts"

type SpendType = "attribute" | "skillGroup" | "increaseSkill" | "newSkill" | "newSpell"

interface SpendKarmaDialogProps extends ControlledDialogProps<void> {
  onNewSpell?: () => void
}

const SPEND_TYPE_LABELS: Record<SpendType, string> = {
  attribute: "Attribute",
  skillGroup: "Skill Group",
  increaseSkill: "Increase Skill",
  newSkill: "New Skill",
  newSpell: "New Spell",
}

const NEW_SPELL_KARMA_COST = 5
const NEW_SKILL_KARMA_COST = 2

const attributeKarmaCost = (newRating: number) => 5 * newRating
const skillGroupKarmaCost = (newRating: number) => 2 * newRating
const increaseSkillKarmaCost = (newRating: number) => 2 * newRating

const SpendKarmaDialog: FC<SpendKarmaDialogProps> = ({ ctrl, onNewSpell }) => {
  const characterSheetStore = useCharacterSheetContext()
  const karmaStore = useKarmaStore()
  const skillsStore = useSkillsStore()

  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const awakeningType = useCharacterSheetSelector((sheet) => sheet.biology.awakening)
  const attributes = useCharacterSheetSelector((sheet) => sheet.attributes)
  const activeSkills = useCharacterSheetSelector((sheet) => sheet.skills.activeSkills)
  const skillGroups = useCharacterSheetSelector((sheet) => sheet.skills.skillGroups)
  const attrInfos = useAllAttrInfos()

  const canLearnSpell = isMagician(awakeningType) && !!onNewSpell

  const [spendType, setSpendType] = useState<SpendType>("attribute")
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey | "">("")
  const [selectedSkillGroupKey, setSelectedSkillGroupKey] = useState<SkillGroupKey | "">("")
  const [selectedIncreaseSkillKey, setSelectedIncreaseSkillKey] = useState<SkillKey | "">("")
  const [selectedNewSkillKey, setSelectedNewSkillKey] = useState<SkillKey | "">("")

  const availableAttributes = useMemo(() => {
    return AttributeOrder.filter((key) => {
      if (key === AttributeKey.essence) return false
      const info = attrInfos[key]
      const currentValue = attributes[key]
      return info.max > 0 && currentValue < info.max
    })
  }, [attrInfos, attributes])

  const availableSkillGroups = useMemo(() => {
    return skillGroups.filter((group) => group.rating < SkillGroupRatingMax)
  }, [skillGroups])

  const availableIncreaseSkills = useMemo(() => {
    const fromActiveSkills = activeSkills
      .filter((skill) => skill.rating < SkillRatingMax)
      .map((skill) => ({
        key: skill.name,
        currentRating: skill.rating,
        groupToBreak: undefined as SkillGroupKey | undefined,
      }))

    const fromSkillGroups = skillGroups.flatMap((group) => {
      return getSkillsInGroup(group.name)
        .filter((skillKey) => !activeSkills.find((skill) => skill.name === skillKey))
        .map((skillKey) => ({
          key: skillKey,
          currentRating: group.rating,
          groupToBreak: group.name as SkillGroupKey,
        }))
    })

    return [...fromActiveSkills, ...fromSkillGroups]
  }, [activeSkills, skillGroups])

  const availableNewSkills = useMemo(() => {
    const existing = new Set(activeSkills.map((skill) => skill.name))
    const coveredByGroup = new Set(skillGroups.flatMap((group) => getSkillsInGroup(group.name)))
    return (Object.keys(skillList) as SkillKey[]).filter(
      (key) => !existing.has(key) && !coveredByGroup.has(key),
    )
  }, [activeSkills, skillGroups])

  const selectedIncreaseSkillEntry = useMemo(
    () => availableIncreaseSkills.find((skill) => skill.key === selectedIncreaseSkillKey),
    [availableIncreaseSkills, selectedIncreaseSkillKey],
  )

  const karmaCost = useMemo((): number | null => {
    switch (spendType) {
      case "attribute": {
        if (!selectedAttribute) return null
        const currentValue = attributes[selectedAttribute]
        return attributeKarmaCost(currentValue + 1)
      }
      case "skillGroup": {
        if (!selectedSkillGroupKey) return null
        const group = skillGroups.find((grp) => grp.name === selectedSkillGroupKey)
        const currentRating = group?.rating ?? 0
        return skillGroupKarmaCost(currentRating + 1)
      }
      case "increaseSkill": {
        if (!selectedIncreaseSkillEntry) return null
        return increaseSkillKarmaCost(selectedIncreaseSkillEntry.currentRating + 1)
      }
      case "newSkill":
        return selectedNewSkillKey ? NEW_SKILL_KARMA_COST : null
      case "newSpell":
        return NEW_SPELL_KARMA_COST
      default:
        return null
    }
  }, [
    spendType,
    selectedAttribute,
    selectedSkillGroupKey,
    selectedIncreaseSkillEntry,
    selectedNewSkillKey,
    attributes,
    skillGroups,
  ])

  const canSave = karmaCost !== null && karmaCost <= currentKarma

  const handleSpendTypeChange = (_event: SyntheticEvent, newValue: SpendType) => {
    setSpendType(newValue)
    setSelectedAttribute("")
    setSelectedSkillGroupKey("")
    setSelectedIncreaseSkillKey("")
    setSelectedNewSkillKey("")
  }

  const handleSave = () => {
    if (!canSave || karmaCost === null) return

    if (spendType === "newSpell") {
      karmaStore.spendKarma(karmaCost)
      ctrl.close()
      onNewSpell?.()
      return
    }

    switch (spendType) {
      case "attribute": {
        if (!selectedAttribute) return
        characterSheetStore.setState(produce((draft) => {
          draft.attributes[selectedAttribute] += 1
        }))
        break
      }
      case "skillGroup": {
        if (!selectedSkillGroupKey) return
        skillsStore.skillGroups.setState(selectedSkillGroupKey, (prev) => ({
          name: selectedSkillGroupKey,
          rating: (prev?.rating ?? 0) + 1,
        }))
        break
      }
      case "increaseSkill": {
        if (!selectedIncreaseSkillEntry) return
        const { key: skillKey, groupToBreak } = selectedIncreaseSkillEntry

        if (groupToBreak) {
          const group = skillGroups.find((grp) => grp.name === groupToBreak)
          const groupRating = group?.rating ?? 0
          const skillsInGroup = getSkillsInGroup(groupToBreak)
          skillsStore.skillGroups.remove(groupToBreak)
          for (const memberSkillKey of skillsInGroup) {
            const existingRating = activeSkills.find((skill) => skill.name === memberSkillKey)?.rating
            skillsStore.activeSkills.setState(memberSkillKey, () => ({
              name: memberSkillKey,
              rating: Math.max(groupRating, existingRating ?? 0),
            }))
          }
        }

        skillsStore.activeSkills.setState(skillKey, (prev) => ({
          name: skillKey,
          rating: (prev?.rating ?? 0) + 1,
        }))
        break
      }
      case "newSkill": {
        if (!selectedNewSkillKey) return
        skillsStore.activeSkills.setState(selectedNewSkillKey, () => ({
          name: selectedNewSkillKey,
          rating: 1,
        }))
        break
      }
      default:
        break
    }

    karmaStore.spendKarma(karmaCost)
    ctrl.close()
  }

  const handleClosed = () => {
    setSpendType("attribute")
    setSelectedAttribute("")
    setSelectedSkillGroupKey("")
    setSelectedIncreaseSkillKey("")
    setSelectedNewSkillKey("")
  }

  const spendTypes: SpendType[] = ["attribute", "skillGroup", "increaseSkill", "newSkill"]
  if (canLearnSpell) spendTypes.push("newSpell")

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClosed={handleClosed}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Stack>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">Unspent Karma</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{currentKarma}</Typography>
          </Stack>

          <Tabs
            value={spendType}
            onChange={handleSpendTypeChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {spendTypes.map((type) => (
              <Tab key={type} value={type} label={SPEND_TYPE_LABELS[type]} />
            ))}
          </Tabs>

          {spendType === "attribute" && (
            <AttributeTab
              availableAttributes={availableAttributes}
              selectedAttribute={selectedAttribute}
              onSelect={setSelectedAttribute}
              attributes={attributes}
              attrInfos={attrInfos}
            />
          )}

          {spendType === "skillGroup" && (
            <SkillGroupTab
              availableSkillGroups={availableSkillGroups}
              selectedSkillGroupKey={selectedSkillGroupKey}
              onSelect={setSelectedSkillGroupKey}
            />
          )}

          {spendType === "increaseSkill" && (
            <IncreaseSkillTab
              availableIncreaseSkills={availableIncreaseSkills}
              selectedKey={selectedIncreaseSkillKey}
              onSelect={setSelectedIncreaseSkillKey}
              selectedEntry={selectedIncreaseSkillEntry}
            />
          )}

          {spendType === "newSkill" && (
            <NewSkillTab
              availableNewSkills={availableNewSkills}
              selectedKey={selectedNewSkillKey}
              onSelect={setSelectedNewSkillKey}
            />
          )}

          {spendType === "newSpell" && (
            <NewSpellTab />
          )}

          {karmaCost !== null && karmaCost > currentKarma && (
            <Alert severity="warning">
              Not enough karma. You need {karmaCost} but only have {currentKarma}.
            </Alert>
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!canSave}
          onClick={handleSave}
        >
          {karmaCost !== null ? `Spend ${karmaCost} Karma` : "Spend Karma"}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface AttributeTabProps {
  availableAttributes: AttributeKey[]
  selectedAttribute: AttributeKey | ""
  onSelect: (key: AttributeKey) => void
  attributes: Record<AttributeKey, number>
  attrInfos: Record<AttributeKey, { min: number, max: number, augMax?: number }>
}

const AttributeTab: FC<AttributeTabProps> = ({
  availableAttributes,
  selectedAttribute,
  onSelect,
  attributes,
  attrInfos,
}) => {
  if (availableAttributes.length === 0) {
    return (
      <Typography color="text.secondary">
        All attributes are already at their natural maximum.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Attribute</InputLabel>
      <Select
        value={selectedAttribute}
        label="Attribute"
        onChange={(e) => onSelect(e.target.value as AttributeKey)}
      >
        {availableAttributes.map((key) => {
          const currentValue = attributes[key]
          const newValue = currentValue + 1
          const cost = attributeKarmaCost(newValue)
          return (
            <MenuItem key={key} value={key}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{AttributeLabels[key]}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {currentValue} → {newValue} / {attrInfos[key].max} &nbsp;·&nbsp; {cost} karma
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

interface SkillGroupTabProps {
  availableSkillGroups: { name: SkillGroupKey, rating: number }[]
  selectedSkillGroupKey: SkillGroupKey | ""
  onSelect: (key: SkillGroupKey) => void
}

const SkillGroupTab: FC<SkillGroupTabProps> = ({
  availableSkillGroups,
  selectedSkillGroupKey,
  onSelect,
}) => {
  if (availableSkillGroups.length === 0) {
    return (
      <Typography color="text.secondary">
        No skill groups available to increase. Skill groups have a maximum rating of {SkillGroupRatingMax}.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Skill Group</InputLabel>
      <Select
        value={selectedSkillGroupKey}
        label="Skill Group"
        onChange={(e) => onSelect(e.target.value as SkillGroupKey)}
      >
        {availableSkillGroups.map((group) => {
          const newRating = group.rating + 1
          const cost = skillGroupKarmaCost(newRating)
          return (
            <MenuItem key={group.name} value={group.name}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{group.name}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {group.rating} → {newRating} &nbsp;·&nbsp; {cost} karma
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

interface IncreaseSkillEntry {
  key: SkillKey
  currentRating: number
  groupToBreak?: SkillGroupKey
}

interface IncreaseSkillTabProps {
  availableIncreaseSkills: IncreaseSkillEntry[]
  selectedKey: SkillKey | ""
  onSelect: (key: SkillKey) => void
  selectedEntry: IncreaseSkillEntry | undefined
}

const IncreaseSkillTab: FC<IncreaseSkillTabProps> = ({
  availableIncreaseSkills,
  selectedKey,
  onSelect,
  selectedEntry,
}) => {
  if (availableIncreaseSkills.length === 0) {
    return (
      <Typography color="text.secondary">
        No skills available to increase. Learn a new skill first, or all skills are already at max rating ({SkillRatingMax}).
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Skill</InputLabel>
        <Select
          value={selectedKey}
          label="Skill"
          onChange={(e) => onSelect(e.target.value as SkillKey)}
        >
          {availableIncreaseSkills.map((entry) => {
            const newRating = entry.currentRating + 1
            const cost = increaseSkillKarmaCost(newRating)
            return (
              <MenuItem key={entry.key} value={entry.key}>
                <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                  <Typography>{entry.key}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                    {entry.currentRating} → {newRating}
                    {entry.groupToBreak ? ` (breaks ${entry.groupToBreak})` : ""}
                    &nbsp;·&nbsp; {cost} karma
                  </Typography>
                </Stack>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      {selectedEntry?.groupToBreak && (
        <Alert severity="info">
          Increasing <strong>{selectedEntry.key}</strong> individually will break the{" "}
          <strong>{selectedEntry.groupToBreak}</strong> skill group. All member skills will
          be set to the current group rating of {selectedEntry.currentRating} as individual skills.
        </Alert>
      )}
    </Stack>
  )
}

interface NewSkillTabProps {
  availableNewSkills: SkillKey[]
  selectedKey: SkillKey | ""
  onSelect: (key: SkillKey) => void
}

const NewSkillTab: FC<NewSkillTabProps> = ({ availableNewSkills, selectedKey, onSelect }) => {
  if (availableNewSkills.length === 0) {
    return (
      <Typography color="text.secondary">
        All skills are already known.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Skill</InputLabel>
      <Select
        value={selectedKey}
        label="Skill"
        onChange={(e) => onSelect(e.target.value as SkillKey)}
      >
        {[...availableNewSkills].sort().map((skillKey) => {
          const info = skillList[skillKey]
          return (
            <MenuItem key={skillKey} value={skillKey}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{skillKey}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {info?.group ?? ""}
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

const NewSpellTab: FC = () => (
  <Typography color="text.secondary">
    Learn a new spell for <strong>5 karma</strong>. You will be prompted to fill in the
    spell details after confirming.
  </Typography>
)

interface UseSpendKarmaDialogProps {
  onNewSpell?: () => void
}

export const useSpendKarmaDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseSpendKarmaDialogProps) => dialogApi.open<void>(
      (ctrl) => (
        <SpendKarmaDialog
          ctrl={ctrl}
          onNewSpell={props?.onNewSpell}
        />
      ),
    ),
  }
}
