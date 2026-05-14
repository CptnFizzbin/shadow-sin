import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import {
  RiChat4Line,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiLightbulbLine,
  RiMedal2Line,
  RiSparklingLine,
} from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import {
  useCharacterSheet,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import type { ControlledDialogProps } from "#/components/dialogs/api/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { selectHasImprovements, selectImprovementsTotalCost } from "#/system/karma/improvements/improvementSelectors.ts"
import { applyImprovements } from "#/system/karma/improvements/improvementUtils.ts"

import { ImprovementActiveSkillList } from "./characterImprovements/improvementActiveSkillList.tsx"
import { ImprovementAttributeList } from "./characterImprovements/improvementAttributeList.tsx"
import { ImprovementKnowledgeSkillList } from "./characterImprovements/improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "./characterImprovements/improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "./characterImprovements/improvementSkillGroupList.tsx"
import { SpendKarmaDialogProvider, useSpendKarmaDialogContext } from "./characterImprovements/spendKarmaDialogContext.tsx"
import { useImprovementSelector } from "./characterImprovements/useImprovementSelector.ts"
import { selectCurrentKarma } from "./karmaSelectors.ts"
import { useKarmaStore } from "./useKarmaStore.ts"

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
  const characterSheetStore = useCharacterSheetContext()
  const karmaStore = useKarmaStore()
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)

  const [activeSection, setActiveSection] = useState<SectionKey>("attribute")

  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
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
    applyImprovements(improvementStore, characterSheetStore)
    ctrl.close()
  }

  const handleClosed = () => {
    improvementStore.removeAll()
    setActiveSection("attribute")
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="md" onClosed={handleClosed}>
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
              return (
                <Tooltip key={navItem.key} title={navItem.label} placement="right">
                  <Box
                    role="button"
                    aria-label={navItem.label}
                    aria-pressed={isActive}
                    onClick={() => setActiveSection(navItem.key)}
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
            {activeSection === "skillGroup" && <ImprovementSkillGroupList onBack={() => setActiveSection("attribute")} />}
            {activeSection === "knowledge" && <ImprovementKnowledgeSkillList />}
            {activeSection === "language" && <ImprovementLanguageSkillList />}
            {activeSection === "spell" && (
              <Stack sx={{ py: 4, alignItems: "center", gap: 1 }}>
                <RiSparklingLine size={32} style={{ opacity: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  Spell learning coming soon
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
            <RiMedal2Line size={16} />
            <Typography variant="caption" color="text.secondary">Remaining</Typography>
            <Chip
              label={`${remainingKarma}k`}
              size="small"
              color={isOverBudget ? "error" : karmaCost > 0 ? "primary" : "default"}
            />
            {karmaCost > 0 && (
              <>
                <Divider orientation="vertical" flexItem />
                <Typography variant="caption" color="text.secondary">Cost</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{karmaCost}k</Typography>
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
