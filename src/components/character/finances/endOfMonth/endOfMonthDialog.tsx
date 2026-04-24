import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { selectLoans } from "#/components/character/finances/nuyen/nuyenSelectors.ts"
import type { NuyenStore } from "#/components/character/finances/nuyen/useNuyenStore.ts"
import { selectLifestyleMonthsPaid, selectLifestyleQuality } from "#/components/character/profile/lifestyleSelectors.ts"
import { useLifestyleStore } from "#/components/character/profile/useLifestyleStore.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Lifestyles } from "#/system/lifestyleType.ts"
import { calculateMonthlyInterest } from "#/system/loanData.ts"

interface EndOfMonthLineItem {
  id: string
  label: string
  nuyenCost: number
  interestAmount: number
  loanId?: UUID
  isLifestyle: boolean
}

interface Props {
  open: boolean
  nuyenStore: NuyenStore
  onClose: () => void
}

export const EndOfMonthDialog: FC<Props> = ({ open, nuyenStore, onClose }) => {
  const lifestyleStore = useLifestyleStore()

  const loans = useStore(nuyenStore, selectLoans)
  const quality = useStore(lifestyleStore, selectLifestyleQuality)
  const monthsPaid = useStore(lifestyleStore, selectLifestyleMonthsPaid)
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
        nuyenStore.applyInterestToLoan(item.loanId)
      }
    }

    if (lifestyleItem && checkedIds.has(lifestyleItem.id)) {
      if (monthsPaid > 0) {
        lifestyleStore.setMonthsPaid(monthsPaid - 1)
      } else {
        nuyenStore.withdraw(upkeep)
      }
    }

    onClose()
  }

  const handleTransitionExited = () => {
    // Read fresh state directly from stores so the reset always matches current data
    const freshLoans = nuyenStore.state.loans
    const freshQuality = lifestyleStore.state.quality
    const freshUpkeep = Lifestyles[freshQuality].upkeep
    setCheckedIds(new Set([
      ...freshLoans.filter((l) => l.interestRate > 0).map((l) => l.id),
      ...(freshUpkeep > 0 ? ["lifestyle"] : []),
    ]))
  }

  return (
    <Dialog open={open} slotProps={{ transition: { onExited: handleTransitionExited } }} fullWidth>
      <DialogTitle sx={{ padding: 1 }}>End of Month</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
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
      </DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <Button color="warning" variant="contained" onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  )
}
