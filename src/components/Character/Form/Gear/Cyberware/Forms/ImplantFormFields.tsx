import Stack from "@mui/material/Stack"
import { z } from "zod"

import type { ImplantFormRestriction } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import { implantFormOpts } from "#/components/Character/Form/Gear/Cyberware/Forms/UseImplantForm.tsx"
import type { AvailabilityRestriction } from "#/components/Character/Form/Gear/Generic/Forms/AvailabilityFormFields.tsx"
import { AvailabilityFormFields } from "#/components/Character/Form/Gear/Generic/Forms/AvailabilityFormFields.tsx"
import { SourceFormFields } from "#/components/Character/Form/Gear/Generic/Forms/SourceFormFields.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import {
  ImplantGrade,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

const implantTypeOptions = [
  { label: "Cyberware", value: ImplantType.cyberware },
  { label: "Bioware", value: ImplantType.bioware },
]

const implantGradeOptions = [
  { label: "Standard (×1 ¥, ×1.0 Ess)", value: ImplantGrade.standard },
  { label: "Alpha (×2 ¥, ×0.8 Ess)", value: ImplantGrade.alpha },
]

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

        <Stack direction="row" gap={1}>
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
        </Stack>

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
                label="Base Cost (¥)"
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

        <group.AppField name="location">
          {(field) => (
            <field.TextField label="Location" fullWidth size="small" />
          )}
        </group.AppField>

        <group.Subscribe selector={(state) => state.values}>
          {(values) => (
            <AvailabilityFormFields
              availabilityRating={values.availabilityRating}
              restriction={values.restriction as AvailabilityRestriction}
              onAvailabilityRatingChange={(value) =>
                group.setFieldValue("availabilityRating", value)
              }
              onRestrictionChange={(value) =>
                group.setFieldValue(
                  "restriction",
                  value as ImplantFormRestriction,
                )
              }
            />
          )}
        </group.Subscribe>

        <group.Subscribe selector={(state) => state.values}>
          {(values) => (
            <SourceFormFields
              sourceBook={values.sourceBook}
              sourcePage={values.sourcePage}
              onSourceBookChange={(value) =>
                group.setFieldValue("sourceBook", value)
              }
              onSourcePageChange={(value) =>
                group.setFieldValue("sourcePage", value)
              }
            />
          )}
        </group.Subscribe>

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
