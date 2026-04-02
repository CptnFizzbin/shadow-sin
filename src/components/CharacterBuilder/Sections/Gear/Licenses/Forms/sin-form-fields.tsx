import { z } from "zod"

import { sinFormOpts } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/use-sin-form.tsx"
import {
  FakeRatingOptions,
  RealRatingOptions,
} from "#/components/CharacterBuilder/Sections/Gear/Licenses/rating-options.ts"
import { withFieldGroup } from "#/integrations/tanstack-form/use-app-form.ts"

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
