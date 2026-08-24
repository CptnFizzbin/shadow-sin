import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { KnownNodeForm } from "#/lib/hooks/runner/matrix/form/useKnownNodeForm.ts"
import { SelectorOptions } from "#/system/selectorOptions.tsx"

const NODE_STAT_MIN = 0
const NODE_STAT_MAX = 99

interface MatrixNodeFieldsProps {
  form: KnownNodeForm
}

export const MatrixNodeFields: FC<MatrixNodeFieldsProps> = ({ form }) => {
  return (
    <Stack sx={{ gap: 2 }}>
      <form.AppField
        name="name"
        validators={{
          onChange: z.string().min(1, "Name is required"),
        }}
      >
        {(field) => <field.TextField label="Name" fullWidth autoFocus autoComplete="off" />}
      </form.AppField>

      <Stack direction="row" sx={{ gap: 2 }}>
        <form.AppField name="nodeType">
          {(field) => <field.SelectField label="Node Type" fullWidth options={SelectorOptions.nodeType} />}
        </form.AppField>

        <form.AppField name="accessLevel">
          {(field) => <field.SelectField label="Access Level" fullWidth options={SelectorOptions.accessLevel} />}
        </form.AppField>
      </Stack>

      <Stack direction="row" sx={{ flexWrap: "wrap" }}>
        <form.AppField name="matrix.system">
          {(field) => (
            <field.CounterField label="System" size="small" min={NODE_STAT_MIN} max={NODE_STAT_MAX} />
          )}
        </form.AppField>

        <form.AppField name="matrix.firewall">
          {(field) => (
            <field.CounterField label="Firewall" size="small" min={NODE_STAT_MIN} max={NODE_STAT_MAX} />
          )}
        </form.AppField>

        <form.AppField name="matrix.response">
          {(field) => (
            <field.CounterField label="Response" size="small" min={NODE_STAT_MIN} max={NODE_STAT_MAX} />
          )}
        </form.AppField>

        <form.AppField name="matrix.signal">
          {(field) => (
            <field.CounterField label="Signal" size="small" min={NODE_STAT_MIN} max={NODE_STAT_MAX} />
          )}
        </form.AppField>
      </Stack>
    </Stack>
  )
}
