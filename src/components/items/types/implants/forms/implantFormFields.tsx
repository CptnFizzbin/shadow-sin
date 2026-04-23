import type { UUID } from "node:crypto"

import { Box } from "@mui/material"
import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { z } from "zod"

import { selectAllGear } from "#/components/items/gearSelectors.ts"
import { implantFormOpts } from "#/components/items/types/implants/forms/useImplantForm.tsx"
import { useGearStore } from "#/components/items/useGearStore.ts"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { ImplantGrade, ImplantLocation, ImplantType, isImplant } from "#/system/gear/implantData.ts"

const implantTypeOptions = [
  { label: "Cyberware", value: ImplantType.cyberware },
  { label: "Bioware", value: ImplantType.bioware },
]

const implantGradeOptions = [
  {
    label: (
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}
      >
        <Box>Standard</Box>
        {" "}
        <Typography color="text.secondary">
          ×1 ¥ | ×1.0 Ess
        </Typography>
      </Stack>
    ),
    value: ImplantGrade.standard,
  },
  {
    label: (
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}
      >
        <Box>Alpha</Box>
        {" "}
        <Typography color="text.secondary">
          ×2 ¥ | ×0.8 Ess
        </Typography>
      </Stack>
    ),
    value: ImplantGrade.alpha,
  },
]

const implantLocationOptions = Object.values(ImplantLocation).map((location) => ({
  label: location,
  value: location,
}))

interface CapacitySlotsChipProps extends ChipProps {
  implantId: UUID
  capacity: number
}

const CapacitySlotsChip: FC<CapacitySlotsChipProps> = ({ implantId, capacity, ...props }) => {
  const gearStore = useGearStore()
  const gear = useStore(gearStore, selectAllGear)
  const usedCapacity = Object.values(gear)
    .filter(isImplant)
    .filter((item) => item.parentId === implantId)
    .reduce((sum, child) => sum + (child.capacityCost ?? 0), 0)

  return (
    <Chip label={`${usedCapacity} / ${capacity} slots used`} variant="outlined" size="small" {...props} />
  )
}

export const ImplantFormFields = withFieldGroup({
  ...implantFormOpts,
  render: function Render({ group }) {
    const parentId = useStore(group.store, (state) => state.values.parentId)
    const itemId = useStore(group.store, (state) => state.values.id)

    return (
      <Stack sx={{ gap: 1 }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ gap: 1 }}>
          <group.AppField name="implantType">
            {(field) => (
              <field.SelectField
                label="Type"
                size="small"
                fullWidth
                options={implantTypeOptions}
              />
            )}
          </group.AppField>

          <group.AppField name="grade">
            {(field) => (
              <field.SelectField
                label="Grade"
                size="small"
                fullWidth
                options={implantGradeOptions}
              />
            )}
          </group.AppField>
        </Stack>

        <Grid container spacing={1} columns={{ xs: 1, sm: 2 }}>
          <Grid size={1}>
            <group.AppField
              name="essenceCost"
              validators={{
                onChange: z
                  .number("Essence cost is required")
                  .min(0, "Essence cost must be 0 or more"),
              }}
            >
              {(field) => (
                <field.CounterField label="Base Essence Cost" min={0} step={0.1} fullWidth />
              )}
            </group.AppField>
          </Grid>

          {parentId && (
            <Grid size={1}>
              <group.AppField
                name="capacityCost"
                validators={{
                  onChange: z
                    .number("Capacity cost is required")
                    .min(0, "Capacity cost must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.CounterField label="Capacity Cost" min={0} fullWidth />
                )}
              </group.AppField>
            </Grid>
          )}

          {!parentId && (
            <>
              <Grid size={1}>
                <group.AppField
                  name="capacity"
                  validators={{
                    onChange: z
                      .number("Capacity is required")
                      .min(0, "Capacity must be 0 or more"),
                  }}
                >
                  {(field) => {
                    const capacity = field.state.value ?? 0

                    return (
                      <Stack sx={{ gap: 1 }}>
                        <field.CounterField label="Capacity" min={0} fullWidth />
                        {capacity >= 1 && (
                          <CapacitySlotsChip implantId={itemId} capacity={capacity} sx={{ width: "100%" }} />
                        )}
                      </Stack>
                    )
                  }}
                </group.AppField>
              </Grid>

              <Grid size={2}>
                <group.AppField name="location">
                  {(field) => (
                    <field.SelectField
                      label="Location"
                      fullWidth
                      size="small"
                      options={implantLocationOptions}
                    />
                  )}
                </group.AppField>
              </Grid>
            </>
          )}
        </Grid>
      </Stack>
    )
  },
})
