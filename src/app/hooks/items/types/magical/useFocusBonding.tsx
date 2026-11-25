import type { FocusData } from "#data/items/magicalData.ts"
import { useAlertDialog } from "#forms/dialog/alertDialog.tsx"
import { useConfirmDialog } from "#forms/dialog/confirmDialog.tsx"
import { getFocusBondingCost } from "#rules/magic/focusRules.ts"
import { KarmaSelectors } from "#state/runner/karma/karma.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

/**
 * Bonding and unbonding a Focus, each behind a confirmation. `bond` spends the Karma the Focus
 * costs, or explains why it can't when the Runner hasn't enough; `unbond` warns that the Karma is
 * lost. Render `outlet` once next to whatever calls them.
 */
export function useFocusBonding() {
  const dispatch = useRunnerStoreDispatch()
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const confirmDialog = useConfirmDialog()
  const alertDialog = useAlertDialog()

  const bond = async (focus: FocusData) => {
    const karmaCost = getFocusBondingCost(focus)

    if (karmaCost > currentKarma) {
      await alertDialog.open({
        title: "Not enough Karma",
        body: `Bonding ${focus.name} costs ${karmaCost} Karma, but you only have ${currentKarma}.`,
        slotProps: { confirmButton: { color: "primary" } },
      })
      return
    }

    const confirmed = await confirmDialog.confirm({
      title: `Bond ${focus.name}?`,
      body: `Bonding this Force ${focus.force} ${focus.focusType} Focus costs ${karmaCost} Karma (you have ${currentKarma}). Once Bonded, it can be equipped and stashed freely.`,
      confirmLabel: `Bond for ${karmaCost} Karma`,
      slotProps: { confirmButton: { color: "primary" } },
    })
    if (confirmed) dispatch(Actions.item.bondFocus(focus))
  }

  const unbond = async (focus: FocusData) => {
    const confirmed = await confirmDialog.confirm({
      title: `Unbond ${focus.name}?`,
      body: `The ${getFocusBondingCost(focus)} Karma spent bonding it is lost, and bonding it again costs the full price.`,
      confirmLabel: "Unbond",
    })
    if (confirmed) dispatch(Actions.item.unbondFocus({ id: focus.id }))
  }

  return {
    bond,
    unbond,
    outlet: (
      <>
        {confirmDialog.outlet}
        {alertDialog.outlet}
      </>
    ),
  }
}
