import type { ReactNode } from "react"

import { itemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearAttachmentFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    isFixed: false as boolean,
    parentItemOptions: [] as SelectOption[],
    fieldLabel: "Parent Item" as string,
    attachmentSlot: undefined as (() => ReactNode) | undefined,
  },
  render: ({ group, isFixed, parentItemOptions, fieldLabel, attachmentSlot }) => {
    return (
      <>
        <group.AppField name="parentId">
          {(field) => (
            <field.SelectField
              label={fieldLabel}
              size="small"
              fullWidth
              options={[{ label: "—", value: "" }, ...parentItemOptions]}
              slotProps={{
                select: { disabled: isFixed },
              }}
            />
          )}
        </group.AppField>

        {attachmentSlot?.()}
      </>
    )
  },
})
