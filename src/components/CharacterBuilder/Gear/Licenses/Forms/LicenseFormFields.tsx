import { z } from "zod"

import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { licenseFormOpts } from "#/components/CharacterBuilder/Gear/Licenses/Forms/UseLicenseForm.tsx"
import {
  FakeRatingOptions,
  RealRatingOptions,
} from "#/components/CharacterBuilder/Gear/Licenses/RatingOptions.ts"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

export const LicenseFormFields = withFieldGroup({
  ...licenseFormOpts,
  props: {
    sins: [] as SinFormState[],
  },
  render: ({ group, sins }) => {
    const sinOptions = sins.map((sin) => ({
      label: sin.name,
      value: sin.id,
    }))

    const findSelectedSin = (sinId: string) => {
      return sins.find((sin) => sin.id === sinId)
    }

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

        <group.AppField name="sinId">
          {(field) => (
            <field.SelectField
              label="SIN"
              fullWidth
              size="small"
              options={sinOptions}
            />
          )}
        </group.AppField>

        <group.Subscribe
          selector={(g) => findSelectedSin(g.values.sinId)}
        >
          {(selectedSin) => (
            <group.AppField name="rating">
              {(field) => {
                const ratingOptions = FakeRatingOptions()

                if (selectedSin?.rating === "real") {
                  ratingOptions.unshift(...RealRatingOptions())
                }

                return (
                  <field.SelectField
                    label="Rating"
                    fullWidth
                    size="small"
                    options={ratingOptions}
                  />
                )
              }}
            </group.AppField>
          )}
        </group.Subscribe>
      </>
    )
  },
})
