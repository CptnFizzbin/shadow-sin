import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/viewer/karmaValue.tsx"
import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { formatNuyen, Nuyen } from "#/components/ui/nuyen.tsx"

import { KarmaBalanceChange } from "./karmaBalanceChange.tsx"
import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"
import { useKarmaPurchase } from "./useKarmaPurchase.ts"

/** Buy Karma step: how much karma to buy, with a preview of both balances. */
export const ManageKarmaStepBuy: FC = () => {
  const workflow = useManageKarmaWorkflow()
  const purchase = useKarmaPurchase(workflow.data.amount)

  return (
    <Stack sx={{ pt: 1, gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {`Each point of karma costs ${formatNuyen(purchase.nuyenPerKarma)}.`}
      </Typography>
      <CounterInput
        label="Karma"
        min={1}
        value={workflow.data.amount}
        onChange={(amount) => workflow.setData((data) => {
          data.amount = amount ?? 0
        })}
        fullWidth
      />
      <Stack sx={{ gap: 0.5 }}>
        <KarmaBalanceChange
          label="Karma"
          before={<KarmaValue amount={purchase.currentKarma} />}
          after={<KarmaValue amount={purchase.karmaAfter} />}
        />
        <KarmaBalanceChange
          label="Nuyen"
          before={<Nuyen amount={purchase.currentNuyen} />}
          after={<Nuyen amount={purchase.nuyenAfter} />}
          isInvalid={!purchase.isAffordable}
        />
      </Stack>
      {!purchase.isAffordable && (
        <Typography variant="body2" color="error">
          Not enough nuyen.
        </Typography>
      )}
    </Stack>
  )
}
