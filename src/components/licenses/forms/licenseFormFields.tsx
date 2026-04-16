import { z } from "zod"

import { useGearByType } from "#/components/gear/useGearApi.ts"
import { licenseFormOpts } from "#/components/licenses/forms/useLicenseForm.tsx"
import {
  FakeRatingOptions,
  RealRatingOptions,
} from "#/components/licenses/ratingOptions.ts"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

export const LicenseFormFields = withFieldGroup({
  ...licenseFormOpts,
  render: function Render({ group }) {
    const sins = useGearByType<SinData>(ItemType.sin)
    const sinOptions = sins.map((sin) => ({ label: sin.name, value: sin.id }))

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

        <group.AppField name="parentId">
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
          selector={(g) => sins.find((sin) => sin.id === g.values.parentId)}
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
