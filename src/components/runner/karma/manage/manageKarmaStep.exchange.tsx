import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/viewer/karmaValue.tsx"
import { CounterInput } from "#/components/ui/form/inputs/counter/counterInput.tsx"
import { formatNuyen, Nuyen } from "#/components/ui/nuyen.tsx"

import { KarmaBalanceChange } from "./karmaBalanceChange.tsx"
import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"
import type { KarmaExchangeDirection } from "./useKarmaExchange.ts"
import { useKarmaExchange } from "./useKarmaExchange.ts"

interface ManageKarmaStepExchangeProps {
  direction: KarmaExchangeDirection
}

/** Buy Karma / Sell Karma step: how much karma to trade, with a preview of both balances. */
export const ManageKarmaStepExchange: FC<ManageKarmaStepExchangeProps> = ({ direction }) => {
  const workflow = useManageKarmaWorkflow()
  const exchange = useKarmaExchange(direction, workflow.data.amount)
  const isBuying = direction === "buy"

  return (
    <Stack sx={{ pt: 1, gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {isBuying
          ? `Each point of karma costs ${formatNuyen(exchange.nuyenPerKarma)}.`
          : `Each point of karma sells for ${formatNuyen(exchange.nuyenPerKarma)}.`}
      </Typography>
      <CounterInput
        label="Karma"
        min={1}
        max={isBuying ? undefined : Math.max(exchange.currentKarma, 1)}
        value={workflow.data.amount}
        onChange={(amount) => workflow.setData((data) => {
          data.amount = amount ?? 0
        })}
        fullWidth
      />
      <Stack sx={{ gap: 0.5 }}>
        <KarmaBalanceChange
          label="Karma"
          before={<KarmaValue amount={exchange.currentKarma} />}
          after={<KarmaValue amount={exchange.karmaAfter} />}
          isInvalid={exchange.karmaAfter < 0}
        />
        <KarmaBalanceChange
          label="Nuyen"
          before={<Nuyen amount={exchange.currentNuyen} />}
          after={<Nuyen amount={exchange.nuyenAfter} />}
          isInvalid={exchange.nuyenAfter < 0}
        />
      </Stack>
      {!exchange.isAffordable && (
        <Typography variant="body2" color="error">
          {isBuying ? "Not enough nuyen." : "Not enough karma."}
        </Typography>
      )}
    </Stack>
  )
}
