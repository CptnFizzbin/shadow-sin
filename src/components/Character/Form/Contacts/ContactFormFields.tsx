import { z } from "zod"

import { contactFormOpts } from "#/components/Character/Form/Contacts/UseContactForm.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

export const ContactFormFields = withFieldGroup({
  ...contactFormOpts,
  render: ({ group }) => {
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

        <group.AppField
          name="connection"
          validators={{
            onChange: z.number().min(1, "Minimum is 1").max(6, "Maximum is 6"),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Connection (1–6)"
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 6 }}
            />
          )}
        </group.AppField>

        <group.AppField
          name="loyalty"
          validators={{
            onChange: z.number().min(1, "Minimum is 1").max(6, "Maximum is 6"),
          }}
        >
          {(field) => (
            <field.NumberField
              label="Loyalty (1–6)"
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 6 }}
            />
          )}
        </group.AppField>

        <group.AppField name="notes">
          {(field) => (
            <field.TextField
              label="Notes (optional)"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </>
    )
  },
})
