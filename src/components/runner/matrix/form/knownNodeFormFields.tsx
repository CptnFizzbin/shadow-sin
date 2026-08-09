import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { z } from "zod"

import type { KnownNodeForm } from "#/lib/hooks/runner/matrix/form/useKnownNodeForm.ts"
import { AccessLevel, AccessLevelLabels } from "#/system/matrix/accessLevel.ts"
import { NodeType, NodeTypeLabels } from "#/system/matrix/nodeType.ts"

const NODE_STAT_MIN = 0
const NODE_STAT_MAX = 99

const nodeTypeOptions = Object.values(NodeType).map((value) => ({ value, label: NodeTypeLabels[value] }))
const accessLevelOptions = Object.values(AccessLevel).map((value) => ({ value, label: AccessLevelLabels[value] }))

interface KnownNodeFormFieldsProps {
  form: KnownNodeForm
}

export const KnownNodeFormFields: FC<KnownNodeFormFieldsProps> = ({ form }) => {
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
          {(field) => <field.SelectField label="Node Type" fullWidth options={nodeTypeOptions} />}
        </form.AppField>

        <form.AppField name="accessLevel">
          {(field) => <field.SelectField label="Access Level" fullWidth options={accessLevelOptions} />}
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
