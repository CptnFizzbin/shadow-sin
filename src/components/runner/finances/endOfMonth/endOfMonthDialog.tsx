import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import { calculateMonthlyInterest } from "#/system/loanData.ts"

interface EndOfMonthLineItem {
  id: string
  label: string
  nuyenCost: number
  interestAmount: number
  loanId?: UUID
  isLifestyle: boolean
}

type Props = ControlledDialogProps<void>

const EndOfMonthDialog: FC<Props> = ({ ctrl }) => {
  const runnerDataStore = useRunnerStoreContext()
  const dispatch = useRunnerStoreDispatch()

  const loans = useRunnerStoreSelector(Selectors.nuyen.selectLoans)
  const quality = useRunnerStoreSelector(Selectors.profile.selectLifestyleQuality) ?? LifestyleType.Street
  const monthsPaid = useRunnerStoreSelector(Selectors.profile.selectLifestyleMonthsPaid) ?? 1
  const upkeep = Lifestyles[quality].upkeep

  const loanItems: EndOfMonthLineItem[] = loans
    .filter((loan) => loan.interestRate > 0)
    .map((loan) => ({
      id: loan.id,
      label: `${loan.lender} loan interest (${loan.interestRate}%/mo)`,
      nuyenCost: 0,
      interestAmount: calculateMonthlyInterest(loan),
      loanId: loan.id,
      isLifestyle: false,
    }))

  const monthsRemainingAfter = monthsPaid - 1
  const lifestyleItem: EndOfMonthLineItem | null = upkeep > 0
    ? {
        id: "lifestyle",
        label: monthsPaid > 0
          ? `${quality} lifestyle (prepaid — ${monthsRemainingAfter} month${monthsRemainingAfter === 1 ? "" : "s"} remaining after)`
          : `${quality} lifestyle upkeep`,
        nuyenCost: monthsPaid === 0 ? upkeep : 0,
        interestAmount: 0,
        isLifestyle: true,
      }
    : null

  const allItems: EndOfMonthLineItem[] = [
    ...loanItems,
    ...(lifestyleItem ? [lifestyleItem] : []),
  ]

  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(allItems.map((item) => item.id)),
  )

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalNuyenCost = allItems
    .filter((item) => checkedIds.has(item.id))
    .reduce((sum, item) => sum + item.nuyenCost, 0)

  const totalInterest = loanItems
    .filter((item) => checkedIds.has(item.id))
    .reduce((sum, item) => sum + item.interestAmount, 0)

  const handleApply = () => {
    for (const item of loanItems) {
      if (checkedIds.has(item.id) && item.loanId) {
        dispatch(Actions.nuyen.applyInterestToLoan(item.loanId))
      }
    }

    if (lifestyleItem && checkedIds.has(lifestyleItem.id)) {
      if (monthsPaid > 0) {
        dispatch(Actions.profile.setLifestyleMonthsPaid(monthsPaid - 1))
      } else {
        dispatch(Actions.nuyen.withdrawNuyen(upkeep))
      }
    }

    ctrl.close()
  }

  const handleTransitionExited = () => {
    // Read fresh state directly from stores so the reset always matches current data
    const freshLoans = runnerDataStore.state.nuyen.loans
    const freshQuality = runnerDataStore.state.profile.lifestyle?.quality ?? LifestyleType.Street
    const freshUpkeep = Lifestyles[freshQuality].upkeep
    setCheckedIds(new Set([
      ...freshLoans.filter((l) => l.interestRate > 0).map((l) => l.id),
      ...(freshUpkeep > 0 ? ["lifestyle"] : []),
    ]))
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false} onClosed={handleTransitionExited}>
      <Dialog.Title>End of Month</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 0.5, padding: 1 }}>
          {allItems.length === 0 && (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              No monthly expenses.
            </Typography>
          )}

          {allItems.map((item) => (
            <FormControlLabel
              key={item.id}
              control={(
                <Checkbox
                  checked={checkedIds.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                  size="small"
                />
              )}
              label={(
                <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, width: "100%" }}>
                  <Typography variant="body2">{item.label}</Typography>
                  {item.interestAmount > 0 && (
                    <Typography variant="body2" color="error.main" noWrap>
                      +<Nuyen amount={item.interestAmount} />
                    </Typography>
                  )}
                  {item.nuyenCost > 0 && (
                    <Typography variant="body2" color="error.main" noWrap>
                      -<Nuyen amount={item.nuyenCost} />
                    </Typography>
                  )}
                </Stack>
              )}
              sx={{ margin: 0, width: "100%" }}
              slotProps={{ typography: { sx: { width: "100%" } } }}
            />
          ))}

          {(totalNuyenCost > 0 || totalInterest > 0) && (
            <>
              <Divider />
              {totalNuyenCost > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Nuyen cost</Typography>
                  <Typography color="error.main">-<Nuyen amount={totalNuyenCost} /></Typography>
                </Stack>
              )}
              {totalInterest > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Interest accrued</Typography>
                  <Typography color="error.main">+<Nuyen amount={totalInterest} /></Typography>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button color="warning" variant="contained" onClick={handleApply}>Apply</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useEndOfMonthDialog = () => useDialog<void>((ctrl) => <EndOfMonthDialog ctrl={ctrl} />)
