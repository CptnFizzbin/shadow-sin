import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/viewer/karmaValue.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { formatNuyen, Nuyen } from "#/components/ui/nuyen.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { GameTableService } from "#/services/gameTable/gameTableService.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { NuyenSelectors } from "#/state/runner/nuyen/nuyen.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { KarmaBalanceChange } from "./karmaBalanceChange.tsx"
import { ManageKarmaStepDialog } from "./manageKarmaStepDialog.tsx"
import { ManageKarmaStepHeader } from "./manageKarmaStepHeader.tsx"
import type { ManageKarmaStepProps } from "./manageKarmaStepProps.ts"

interface KarmaExchangeStepProps extends ManageKarmaStepProps {
  /** `buy` trades nuyen for karma; `sell` trades karma for nuyen. */
  direction: "buy" | "sell"
}

/** Manage Karma step for trading nuyen and karma at the Table's exchange rate. */
export const KarmaExchangeStep: FC<KarmaExchangeStepProps> = ({ direction, ctrl, onBack }) => {
  const dispatch = useRunnerStoreDispatch()
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)
  const currentNuyen = useRunnerSelector(NuyenSelectors.selectAmount)

  const isBuying = direction === "buy"
  const { buyNuyenPerKarma, sellNuyenPerKarma } = GameTableService.karmaExchangeRates
  const nuyenPerKarma = isBuying ? buyNuyenPerKarma : sellNuyenPerKarma

  const form = useAppForm({
    defaultValues: { amount: 1 as number | undefined },
    onSubmit: ({ value }) => {
      if (!value.amount) return
      const action = isBuying ? Actions.karma.buyKarma : Actions.karma.sellKarma
      dispatch(action(value.amount, nuyenPerKarma))
      ctrl.close()
    },
  })

  const amount = useSelector(form.baseStore, (state) => state.values.amount) ?? 0
  const nuyenTotal = amount * nuyenPerKarma
  const karmaAfter = isBuying ? currentKarma + amount : currentKarma - amount
  const nuyenAfter = isBuying ? currentNuyen - nuyenTotal : currentNuyen + nuyenTotal
  const isAffordable = isBuying ? nuyenAfter >= 0 : karmaAfter >= 0
  const canSubmit = amount > 0 && isAffordable

  const title = isBuying ? "Buy Karma" : "Sell Karma"

  return (
    <ManageKarmaStepDialog ctrl={ctrl}>
      <Dialog.Title>
        <ManageKarmaStepHeader title={title} onBack={onBack} />
      </Dialog.Title>
      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ pt: 1, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {isBuying
                ? `Each point of karma costs ${formatNuyen(nuyenPerKarma)}.`
                : `Each point of karma sells for ${formatNuyen(nuyenPerKarma)}.`}
            </Typography>
            <form.AppField name="amount">
              {(field) => (
                <field.CounterField
                  label="Karma"
                  min={1}
                  max={isBuying ? undefined : Math.max(currentKarma, 1)}
                  fullWidth
                />
              )}
            </form.AppField>
            <Stack sx={{ gap: 0.5 }}>
              <KarmaBalanceChange
                label="Karma"
                before={<KarmaValue amount={currentKarma} />}
                after={<KarmaValue amount={karmaAfter} />}
                isInvalid={karmaAfter < 0}
              />
              <KarmaBalanceChange
                label="Nuyen"
                before={<Nuyen amount={currentNuyen} />}
                after={<Nuyen amount={nuyenAfter} />}
                isInvalid={nuyenAfter < 0}
              />
            </Stack>
            {!isAffordable && (
              <Typography variant="body2" color="error">
                {isBuying ? "Not enough nuyen." : "Not enough karma."}
              </Typography>
            )}
          </Stack>
        </form.AppForm>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>Cancel</Button>
        <Button
          color="secondary"
          variant="contained"
          disabled={!canSubmit}
          onClick={() => form.handleSubmit()}
        >
          {isBuying ? "Buy" : "Sell"}
        </Button>
      </Dialog.Actions>
    </ManageKarmaStepDialog>
  )
}
