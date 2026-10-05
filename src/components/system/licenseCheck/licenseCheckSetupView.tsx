import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"
import { useMemo } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { ItemActions } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useRunnerStateDispatch } from "#/state/runnerState.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { LicenseCheckChecklistRow } from "./licenseCheckChecklistRow.tsx"
import { useLicenseCheck } from "./licenseCheckContext.tsx"
import { buildVerificationLanes } from "./licenseCheckLanes.ts"

const ratingOptions = [1, 2, 3, 4, 5, 6]

export const LicenseCheckSetupView: FC = () => {
  const gear = useRunnerSelector(ItemSelectors.selectAll)
  const dispatch = useRunnerStateDispatch()
  const { scannerRating, setScannerRating, activeSinId, setActiveSinId } = useLicenseCheck()

  // Display-only — Start Scan builds its own checked-items-only queue from these lanes.
  const lanes = useMemo(
    () => buildVerificationLanes(gear, activeSinId),
    [gear, activeSinId],
  )

  const sinLanes = lanes.filter((lane) => lane.checks[0]?.kind === "sin")
  const unlicensedLane = lanes.find((lane) => lane.key === "unlicensed")
  const forbiddenLane = lanes.find((lane) => lane.key === "forbidden")

  const stashableChecks = [...(unlicensedLane?.checks ?? []), ...(forbiddenLane?.checks ?? [])]

  const stashUnlicensedAndForbidden = () => {
    for (const check of stashableChecks) {
      dispatch(ItemActions.setStashed({ id: check.itemId as UUID, stashed: true }))
    }
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack>
        <Label>Verification System Rating</Label>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={scannerRating}
          onChange={(_, value: number | null) => {
            if (value !== null) setScannerRating(value)
          }}
        >
          {ratingOptions.map((rating) => (
            <ToggleButton key={rating} value={rating} sx={{ px: 1.5, flexGrow: 1 }}>
              {rating}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {sinLanes.length > 0 && (
        <Stack>
          <Label>SINs</Label>
          <RadioGroup
            aria-label="Active SIN"
            value={activeSinId ?? ""}
            onChange={(_, value) => setActiveSinId(value)}
          >
            {sinLanes.map((lane) => {
              const [sinCheck, ...gearChecks] = lane.checks

              return (
                <Stack key={lane.key} role="group" aria-label={`SIN: ${lane.title}`} sx={{ gap: 0.5, border: "1px solid", borderColor: "divider", padding: 1 }}>
                  <Stack direction="row" sx={{ alignItems: "center" }}>
                    <Radio
                      size="small"
                      value={lane.key}
                      slotProps={{ input: { "aria-label": `Active SIN: ${gear[sinCheck.itemId].name}` } }}
                    />
                    <LicenseCheckChecklistRow item={gear[sinCheck.itemId]} check={sinCheck} />
                  </Stack>

                  {gearChecks.length > 0 && (
                    <Stack
                      sx={{
                        gap: 0.5,
                        paddingLeft: 1,
                        borderLeft: "2px solid",
                        borderColor: "divider",
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        paddingY: 0.5,
                      }}
                    >
                      {gearChecks.map((check) => (
                        <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
                      ))}
                    </Stack>
                  )}
                </Stack>
              )
            })}
          </RadioGroup>
        </Stack>
      )}

      {unlicensedLane && (
        <Stack role="group" aria-label="Unlicensed Gear" sx={{ gap: 0.5 }}>
          <Label>Unlicensed Gear</Label>

          <Alert variant="outlined" severity="warning">
            <AlertTitle>Unlicensed items detected</AlertTitle>
            These items will be questioned by officials. A good reason will needed.
          </Alert>

          <Stack
            sx={{
              gap: 0.5,
              paddingLeft: 1,
              borderLeft: "2px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: 1,
              paddingY: 0.5,
            }}
          >
            {unlicensedLane.checks.map((check) => (
              <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
            ))}
          </Stack>
        </Stack>
      )}

      {forbiddenLane && (
        <Stack role="group" aria-label="Forbidden Gear" sx={{ gap: 0.5 }}>
          <Label>Forbidden Gear</Label>

          <Alert variant="outlined" severity="error">
            <AlertTitle>Forbidden items detected</AlertTitle>
            These items will be questioned by officials. You better have a <em>really</em> good story for them.
          </Alert>

          <Stack
            sx={{
              gap: 0.5,
              paddingLeft: 1,
              borderLeft: "2px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: 1,
              paddingY: 0.5,
            }}
          >
            {forbiddenLane.checks.map((check) => (
              <LicenseCheckChecklistRow key={check.itemId} item={gear[check.itemId]} check={check} />
            ))}
          </Stack>
        </Stack>
      )}

      {stashableChecks.length > 0 && (
        <Button variant="outlined" color="warning" onClick={stashUnlicensedAndForbidden}>
          Stash all unlicensed and forbidden items
        </Button>
      )}
    </Stack>
  )
}
