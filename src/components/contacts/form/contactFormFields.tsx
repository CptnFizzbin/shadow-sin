import Stack from "@mui/material/Stack"
import { z } from "zod"

import { contactFormOpts } from "#/components/contacts/form/useContactForm.tsx"
import { createRatingOptions } from "#/components/ui/ratingUtils.ts"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

const ratingOptions = createRatingOptions({ min: 1, max: 6 })

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
            <field.TextField label="Name" fullWidth size="small" autoFocus autoComplete="off" />
          )}
        </group.AppField>

        <Stack direction="row" sx={{ gap: 1 }}>
          <group.AppField name="connection">
            {(field) => (
              <field.SelectField
                label="Connection"
                fullWidth
                size="small"
                options={ratingOptions}
              />
            )}
          </group.AppField>

          <group.AppField name="loyalty">
            {(field) => (
              <field.SelectField
                label="Loyalty"
                fullWidth
                size="small"
                options={ratingOptions}
              />
            )}
          </group.AppField>
        </Stack>

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
