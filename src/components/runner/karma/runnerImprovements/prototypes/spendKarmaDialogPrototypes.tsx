// PROTOTYPE — Four mobile-first layout variants of the Spend Karma dialog
// (plus the current layout as a baseline), switchable via the floating
// Prototype bar while the dialog is open. The question: which navigation
// structure works best when horizontal space is constrained? Delete the losing
// variants (this whole directory) and fold the winner into
// spendKarmaDialogContent.tsx once a direction is chosen. See NOTES.md.
import type { FC } from "react"

import { SpendKarmaDialogProvider } from "#/components/runner/karma/runnerImprovements/spendKarmaDialogContext.tsx"
import { SpendKarmaDialogContent } from "#/components/runner/karma/spendKarmaDialogContent.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

import { SpendKarmaVariantAccordion } from "./spendKarmaVariantAccordion.tsx"
import { SpendKarmaVariantBottomNav } from "./spendKarmaVariantBottomNav.tsx"
import { SpendKarmaVariantDrilldown } from "./spendKarmaVariantDrilldown.tsx"
import { SpendKarmaVariantTabs } from "./spendKarmaVariantTabs.tsx"

export const SpendKarmaDialogPrototypes: FC<ControlledDialogProps> = ({ ctrl }) => {
  const isDialogOpen = useSelector(ctrl.store, (state) => state.open)

  // Mount only while open so the floating switcher bar doesn't linger on the
  // page after the dialog closes. This skips the dialog exit animation —
  // acceptable for a prototype. Unmounting also discards the provider's
  // ImprovementStore, so every open starts with an empty queue (the queue is
  // shared across variants while the dialog stays open).
  if (!isDialogOpen) return null

  return (
    <SpendKarmaDialogProvider>
      <Prototype>
        <Prototype.Item title="Current (left rail)">
          {/* Baseline for comparison. Creates its own nested ImprovementStore,
              so its queue does not carry over to the other variants. */}
          <SpendKarmaDialogContent ctrl={ctrl} />
        </Prototype.Item>
        <Prototype.Item title="Scrollable tabs">
          <SpendKarmaVariantTabs ctrl={ctrl} />
        </Prototype.Item>
        <Prototype.Item title="Bottom nav">
          <SpendKarmaVariantBottomNav ctrl={ctrl} />
        </Prototype.Item>
        <Prototype.Item title="Accordions">
          <SpendKarmaVariantAccordion ctrl={ctrl} />
        </Prototype.Item>
        <Prototype.Item title="Drill-down">
          <SpendKarmaVariantDrilldown ctrl={ctrl} />
        </Prototype.Item>
      </Prototype>
    </SpendKarmaDialogProvider>
  )
}
