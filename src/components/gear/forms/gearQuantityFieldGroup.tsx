import { z } from "zod"

import { gearItemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearQuantityFieldGroup = withFieldGroup({
  ...gearItemFormOpts,
  render: ({ group }) => {
    return (
      <group.AppField
        name="quantity"
        validators={{
          onChange: z
            .number("Quantity is required")
            .int("Quantity must be a whole number")
            .min(1, "Quantity must be at least 1"),
        }}
      >
        {(field) => (
          <field.CounterField label="Quantity" min={1} max={999} />
        )}
      </group.AppField>
    )
  },
})
