import { z } from "zod"

import { sinFormOpts } from "#/components/Character/Form/Gear/Licenses/Forms/UseSinForm.tsx"
import {
  FakeRatingOptions,
  RealRatingOptions,
} from "#/components/Character/Form/Gear/Licenses/RatingOptions.ts"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

export const SinFormFields = withFieldGroup({
  ...sinFormOpts,
  props: {
    allowReal: true as boolean | undefined,
  },
  render: ({ group, allowReal }) => {
    const ratingOptions = [
      ...RealRatingOptions(!allowReal),
      ...FakeRatingOptions(),
    ]

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

        <group.AppField name="rating">
          {(field) => (
            <field.SelectField
              label="Rating"
              fullWidth
              size="small"
              options={ratingOptions}
            />
          )}
        </group.AppField>
      </>
    )
  },
})
