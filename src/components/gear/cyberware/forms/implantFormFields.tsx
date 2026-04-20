import { Box } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { z } from "zod"

import { implantFormOpts } from "#/components/gear/cyberware/forms/useImplantForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/system/gear/implantData.ts"

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

export const ImplantFormFields = withFieldGroup({
  ...implantFormOpts,
  render: ({ group }) => {
    return (
      <Stack sx={{ gap: 1 }}>
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

        <Stack direction="row" sx={{ gap: 1 }}>
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

        <group.AppField
          name="rating"
          validators={{
            onChange: z
              .number()
              .int("Rating must be a whole number")
              .min(1, "Rating must be at least 1")
              .optional(),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Rating"
              size="small"
              sx={{ width: 120 }}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
          )}
        </group.AppField>

        <group.Subscribe selector={({ values }) => values.parentId}>
          {(parentId) => (
            <>
              <Stack direction="row" sx={{ gap: 1 }}>
                {parentId
                  ? (
                      <group.AppField
                        name="capacityCost"
                        validators={{
                          onChange: z
                            .number("Capacity cost is required")
                            .min(0, "Capacity cost must be 0 or more"),
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
                            .number("Capacity is required")
                            .min(0, "Capacity must be 0 or more"),
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
      </Stack>
    )
  },
})
