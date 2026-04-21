import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { itemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearCostAvailabilityFieldGroup = withFieldGroup({
  ...itemFormOpts,
  render: ({ group }) => {
    return <AvailabilityFieldGroup form={group} fields="availability" />
  },
})
