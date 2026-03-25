import { z } from "zod"

import { GearMaxAvailability } from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import { sinFormOpts } from "#/components/CharacterBuilder/Gear/Licenses/Forms/UseSinForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

const MaxRating = Math.floor(GearMaxAvailability / 3)

export const SinFormFields = withFieldGroup({
  ...sinFormOpts,
  props: {
    allowReal: true as boolean | undefined,
  },
  render: ({ group, allowReal }) => {
    return (
      <>
        <group.AppField
          name="name"
          validators={{
            onChange: z.string().min(1, "Name is required"),
          }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField name="verification.kind">
          {(field) => {
            const kindOptions = [
              ...(allowReal
                ? [{ label: "Real", value: VerificationKind.Real }]
                : []),
              { label: "Fake", value: VerificationKind.Fake },
            ]
            return (
              <field.SelectField
                label="Type"
                fullWidth
                size="small"
                options={kindOptions}
              />
            )
          }}
        </group.AppField>

        <group.Subscribe selector={(state) => state.values.verification.kind}>
          {(kind) =>
            kind === VerificationKind.Fake && (
              <group.AppField name="verification.rating">
                {(field) => (
                  <field.NumberField
                    label="Rating"
                    fullWidth
                    size="small"
                    inputProps={{ min: 1, max: MaxRating }}
                  />
                )}
              </group.AppField>
            )
          }
        </group.Subscribe>
      </>
    )
  },
})
