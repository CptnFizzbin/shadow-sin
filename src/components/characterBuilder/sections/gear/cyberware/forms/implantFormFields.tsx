import { Box } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { implantFormOpts } from "#/components/characterBuilder/sections/gear/cyberware/forms/useImplantForm.tsx"
import { GameEffectsFieldGroup } from "#/components/gameEffects/gameEffectsFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/lib/system/gear/implantData.ts"

const implantTypeOptions = [
  { label: "Cyberware", value: ImplantType.cyberware },
  { label: "Bioware", value: ImplantType.bioware },
]

const implantGradeOptions = [
  {
    label: (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
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
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
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

export const ImplantFormFields = withFieldGroup({
  ...implantFormOpts,
  render: ({ group }) => {
    return (
      <Stack gap={1}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField name="implantType">
          {(field) => (
            <field.SelectField
              label="Type"
              size="small"
              sx={{ flex: 1 }}
              options={implantTypeOptions}
            />
          )}
        </group.AppField>

        <group.AppField name="grade">
          {(field) => (
            <field.SelectField
              label="Grade"
              size="small"
              sx={{ flex: 1 }}
              options={implantGradeOptions}
            />
          )}
        </group.AppField>

        <Stack direction="row" gap={1}>
          <group.AppField
            name="cost"
            validators={{
              onChange: z
                .number("Cost is required")
                .min(0, "Cost must be 0 or more"),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Base Cost"
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </group.AppField>

          <group.AppField
            name="essenceCost"
            validators={{
              onChange: z
                .number("Essence cost is required")
                .min(0, "Essence cost must be 0 or more"),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Base Essence Cost"
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </group.AppField>
        </Stack>

        <group.Subscribe selector={({ values }) => values.parentId}>
          {(parentId) => (
            <>
              <Stack direction="row" gap={1}>
                {parentId
                  ? (
                      <group.AppField
                        name="capacityCost"
                        validators={{
                          onChange: z
                            .number("Essence cost is required")
                            .min(0, "Essence cost must be 0 or more"),
                        }}
                      >
                        {(field) => (
                          <field.NumberField
                            label="Capacity Cost"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        )}
                      </group.AppField>
                    )
                  : (
                      <group.AppField
                        name="capacity"
                        validators={{
                          onChange: z
                            .number("Essence cost is required")
                            .min(0, "Essence cost must be 0 or more"),
                        }}
                      >
                        {(field) => (
                          <field.NumberField
                            label="Capacity"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        )}
                      </group.AppField>
                    )}
              </Stack>

              {!parentId && (
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
              )}
            </>
          )}
        </group.Subscribe>

        <AvailabilityFieldGroup
          form={group}
          fields="availability"
        />
        <SourceFieldGroup form={group} fields={{ source: "source" }} />
        <GameEffectsFieldGroup form={group} fields={{ effects: "effects" }} />

        <group.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description / Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
