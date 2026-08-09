import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { z } from "zod"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ItemData } from "#/system/itemData.ts"

interface CostFieldGroupProps {
  enableQuantity?: boolean
  onBuyMore?: () => void
}

export const GearCostFieldGroup = withFieldGroup<ItemData, unknown, CostFieldGroupProps>({
  render: ({ group, enableQuantity, onBuyMore }) => {
    return (
      <Stack direction="row" sx={{ alignItems: "flex-start" }}>
        <group.AppField
          name="cost"
          validators={{
            onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
          }}
        >
          {(field) => (
            <field.NuyenField label="Cost" size="small" sx={{ flex: 1 }} />
          )}
        </group.AppField>

        {enableQuantity && (
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
              <field.CounterField label="Quantity" min={1} sx={{ flexShrink: 1 }} />
            )}
          </group.AppField>
        )}

        {enableQuantity && onBuyMore && (
          <Button variant="outlined" onClick={onBuyMore} sx={{ height: 40 }}>
            Buy More
          </Button>
        )}
      </Stack>
    )
  },
})
