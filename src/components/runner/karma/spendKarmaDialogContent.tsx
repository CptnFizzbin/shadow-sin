import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiChat4Line, RiFlashlightLine, RiHeartPulseLine, RiLightbulbLine, RiSparklingLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { selectHasImprovements, selectImprovementsTotalCost } from "#/system/karma/improvements/improvementSelectors.ts"
import { applyImprovements } from "#/system/karma/improvements/improvementUtils.ts"

import { KarmaChip } from "./karmaChip.tsx"
import { KarmaValue } from "./karmaValue.tsx"
import { ImprovementActiveSkillList } from "./runnerImprovements/improvementActiveSkillList.tsx"
import { ImprovementAttributeList } from "./runnerImprovements/improvementAttributeList.tsx"
import { ImprovementKnowledgeSkillList } from "./runnerImprovements/improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "./runnerImprovements/improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "./runnerImprovements/improvementSkillGroupList.tsx"
import { ImprovementSpellList } from "./runnerImprovements/improvementSpellList.tsx"
import { SpendKarmaDialogProvider, useSpendKarmaDialogContext } from "./runnerImprovements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./runnerImprovements/useImprovementSelector.ts"

type SectionKey = "attribute" | "skill" | "skillGroup" | "knowledge" | "language" | "spell"

interface NavItemConfig {
  key: SectionKey
  label: string
  icon: ReactNode
  showForSpellcasterOnly?: boolean
}

const NAV_ITEMS: NavItemConfig[] = [
  { key: "attribute", label: "Attributes", icon: <RiHeartPulseLine size={20} /> },
  { key: "skill", label: "Skills", icon: <RiFlashlightLine size={20} /> },
  { key: "skillGroup", label: "Groups", icon: <RiFlashlightLine size={20} /> },
  { key: "knowledge", label: "Knowledge", icon: <RiLightbulbLine size={20} /> },
  { key: "language", label: "Language", icon: <RiChat4Line size={20} /> },
  { key: "spell", label: "Spells", icon: <RiSparklingLine size={20} />, showForSpellcasterOnly: true },
]

// Inner component that consumes SpendKarmaDialogProvider context
const SpendKarmaDialogInner: FC<ControlledDialogProps> = ({ ctrl }) => {
  const { improvementStore } = useSpendKarmaDialogContext()
  const runnerDataStore = useRunnerStoreContext()
  const awakening = useRunnerStoreSelector((sheet) => sheet.biology.awakening)

  const [activeSection, setActiveSection] = useState<SectionKey>("attribute")

  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)
  const karmaCost = useImprovementSelector(selectImprovementsTotalCost)
  const hasImprovements = useImprovementSelector(selectHasImprovements)
  const remainingKarma = currentKarma - karmaCost
  const isOverBudget = remainingKarma < 0
  const canSave = hasImprovements && !isOverBudget

  const isSpellcaster = isMagician(awakening)

  const visibleNavItems = NAV_ITEMS.filter(
    (navItem) => !navItem.showForSpellcasterOnly || isSpellcaster,
  )

  const handleSave = () => {
    if (!canSave) return
    applyImprovements(improvementStore, runnerDataStore)
    ctrl.close()
  }

  const handleClosed = () => {
    improvementStore.removeAll()
    setActiveSection("attribute")
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="md" onClose={false} onClosed={handleClosed}>
      <Dialog.Title>Spend Karma</Dialog.Title>

      <Dialog.Content>
        <Box sx={{ display: "flex", flex: 1, minHeight: 420 }}>
          {/* Left nav rail */}
          <Box
            sx={{
              width: 96,
              borderRight: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              py: 0.5,
              flexShrink: 0,
            }}
          >
            {visibleNavItems.map((navItem) => {
              const isActive = activeSection === navItem.key
              const activate = () => setActiveSection(navItem.key)
              return (
                <Tooltip key={navItem.key} title={navItem.label} placement="right">
                  <Box
                    role="button"
                    tabIndex={0}
                    aria-label={navItem.label}
                    aria-pressed={isActive}
                    onClick={activate}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        activate()
                      } else if (e.key === " ") {
                        // Prevent page scroll on Space.
                        e.preventDefault()
                        activate()
                      }
                    }}
                    sx={{
                      "display": "flex",
                      "flexDirection": "column",
                      "alignItems": "center",
                      "gap": 0.5,
                      "py": 1.25,
                      "px": 0.5,
                      "cursor": "pointer",
                      "bgcolor": isActive ? "action.selected" : "transparent",
                      "borderLeft": "3px solid",
                      "borderColor": isActive ? "primary.main" : "transparent",
                      "transition": "all 0.15s",
                      "&:hover": { bgcolor: "action.hover" },
                      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 },
                    }}
                  >
                    <Box sx={{ color: isActive ? "primary.main" : "text.secondary" }}>
                      {navItem.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6rem",
                        color: isActive ? "primary.main" : "text.secondary",
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {navItem.label}
                    </Typography>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>

          {/* Right content panel */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {activeSection === "attribute" && <ImprovementAttributeList />}
            {activeSection === "skill" && <ImprovementActiveSkillList />}
            {activeSection === "skillGroup"
              && <ImprovementSkillGroupList onBack={() => setActiveSection("attribute")} />}
            {activeSection === "knowledge" && <ImprovementKnowledgeSkillList />}
            {activeSection === "language" && <ImprovementLanguageSkillList />}
            {activeSection === "spell" && <ImprovementSpellList />}
          </Box>
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">Remaining</Typography>
            <KarmaChip
              amount={remainingKarma}
              color={isOverBudget ? "error" : karmaCost > 0 ? "primary" : "default"}
            />
            {karmaCost > 0 && (
              <>
                <Divider orientation="vertical" flexItem />
                <Typography variant="caption" color="text.secondary">Cost</Typography>
                <KarmaValue amount={karmaCost} sx={{ fontWeight: "bold" }} />
              </>
            )}
          </Stack>

          <Stack direction="row" sx={{ gap: 1 }}>
            <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const SpendKarmaDialogContent: FC<ControlledDialogProps> = ({ ctrl, onClose }) => (
  <SpendKarmaDialogProvider>
    <SpendKarmaDialogInner ctrl={ctrl} onClose={onClose} />
  </SpendKarmaDialogProvider>
)
