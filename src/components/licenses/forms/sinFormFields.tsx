import { z } from "zod"

import { sinFormOpts } from "#/components/licenses/forms/useSinForm.tsx"
import { FakeRatingOptions, RealRatingOptions } from "#/components/licenses/ratingOptions.ts"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

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
