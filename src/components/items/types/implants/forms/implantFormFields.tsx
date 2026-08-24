import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { z } from "zod"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { implantFormOpts } from "#/lib/hooks/items/types/implants/forms/useImplantForm.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { isImplant } from "#/system/gear/implantData.ts"
import { SelectorOptions } from "#/system/selectorOptions.tsx"

interface CapacitySlotsChipProps extends ChipProps {
  implantId: UUID
  capacity: number
}

const CapacitySlotsChip: FC<CapacitySlotsChipProps> = ({ implantId, capacity, ...props }) => {
  const gear = useRunnerStoreSelector(Selectors.gear.selectAllGear)
  const usedCapacity = Object.values(gear)
    .filter(isImplant)
    .filter((item) => item.items.parentId === implantId)
    .reduce((sum, child) => sum + (child.capacityCost ?? 0), 0)

  return (
    <Chip label={`${usedCapacity} / ${capacity} slots used`} variant="outlined" size="small" {...props} />
  )
}

export const ImplantFormFields = withFieldGroup({
  ...implantFormOpts,
  render: function Render({ group }) {
    const parentId = useSelector(group.store, (state) => state.values.items.parentId)
    const itemId = useSelector(group.store, (state) => state.values.id)

    return (
      <Stack>
        <Stack direction={{ xs: "column", md: "row" }}>
          <group.AppField name="implantType">
            {(field) => (
              <field.SelectField
                label="Type"
                size="small"
                fullWidth
                options={SelectorOptions.implantType}
              />
            )}
          </group.AppField>

          <group.AppField name="grade">
            {(field) => (
              <field.SelectField
                label="Grade"
                size="small"
                fullWidth
                options={SelectorOptions.implantGrade}
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
                      <Stack>
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
                      options={SelectorOptions.implantLocation}
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
