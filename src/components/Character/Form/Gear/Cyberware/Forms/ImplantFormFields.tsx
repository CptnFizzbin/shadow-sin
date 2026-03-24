import { Box } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { z } from "zod"

import {
  implantFieldMap,
  implantFormOpts,
} from "#/components/Character/Form/Gear/Cyberware/Forms/UseImplantForm.tsx"
import { AvailabilityFieldGroup } from "#/components/Character/Form/General/Form/AvailabilityFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/Character/Form/General/Form/SourceFieldGroup.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"
import {
  ImplantGrade,
  ImplantLocation,
  ImplantType,
} from "#/lib/system/types/gear/implantData.ts"

const implantTypeOptions = [
  { label: "Cyberware", value: ImplantType.cyberware },
  { label: "Bioware", value: ImplantType.bioware },
]

const implantGradeOptions = [
  {
    label: (
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        flexGrow={1}
      >
        <Box>Standard</Box>{" "}
        <Typography variant={"caption"} color={"text.secondary"}>
          ×1 ¥ | ×1.0 Ess
        </Typography>
      </Stack>
    ),
    value: ImplantGrade.standard,
  },
  {
    label: (
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        flexGrow={1}
      >
        <Box>Alpha</Box>{" "}
        <Typography variant={"caption"} color={"text.secondary"}>
          ×2 ¥ | ×0.8 Ess
        </Typography>
      </Stack>
    ),
    value: ImplantGrade.alpha,
  },
]

const implantLocationOptions = [
  { label: "Right Hand", value: ImplantLocation.rightHand },
  { label: "Left Hand", value: ImplantLocation.leftHand },
  { label: "Right Arm", value: ImplantLocation.rightArm },
  { label: "Left Arm", value: ImplantLocation.leftArm },
  { label: "Right Leg", value: ImplantLocation.rightLeg },
  { label: "Left Leg", value: ImplantLocation.leftLeg },
  { label: "Right Foot", value: ImplantLocation.rightFoot },
  { label: "Left Foot", value: ImplantLocation.leftFoot },
  { label: "Torso", value: ImplantLocation.torso },
  { label: "Eyes", value: ImplantLocation.eyes },
  { label: "Ears", value: ImplantLocation.ears },
]

export const ImplantFormFields = withFieldGroup({
  ...implantFormOpts,
  render: ({ group }) => {
    return (
      <Stack gap={1}>
        <group.AppField
          name="name"
          validators={{ onChange: z.string().min(1, "Name is required") }}
        >
          {(field) => (
            <field.TextField label="Name" fullWidth size="small" autoFocus />
          )}
        </group.AppField>

        <group.AppField name="implantType">
          {(field) => (
            <field.SelectField
              label="Type"
              size="small"
              sx={{ flex: 1 }}
              options={implantTypeOptions}
            />
          )}
        </group.AppField>

        <group.AppField name="grade">
          {(field) => (
            <field.SelectField
              label="Grade"
              size="small"
              sx={{ flex: 1 }}
              options={implantGradeOptions}
            />
          )}
        </group.AppField>

        <Stack direction="row" gap={1}>
          <group.AppField
            name="cost"
            validators={{
              onChange: z
                .number("Cost is required")
                .min(0, "Cost must be 0 or more"),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Base Cost (¥)"
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </group.AppField>

          <group.AppField
            name="essenceCost"
            validators={{
              onChange: z
                .number("Essence cost is required")
                .min(0, "Essence cost must be 0 or more"),
            }}
          >
            {(field) => (
              <field.NumberField
                label="Base Essence Cost"
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </group.AppField>
        </Stack>

        <group.AppField name="location">
          {(field) => (
            <field.SelectField
              label="Location"
              fullWidth
              size="small"
              options={implantLocationOptions}
            />
          )}
        </group.AppField>

        <AvailabilityFieldGroup form={group} fields={implantFieldMap} />
        <SourceFieldGroup form={group} fields={implantFieldMap} />

        <group.AppField name="notes">
          {(field) => (
            <field.TextField
              label="Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
