import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import { z } from "zod"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { contactFormOpts } from "#/lib/hooks/runner/contacts/form/useContactForm.tsx"
import { FavourDirection } from "#/system/favourData.ts"

const RATING_MIN = 1
const RATING_MAX = 6

const favourDirectionOptions: { value: FavourDirection, label: string }[] = [
  { value: FavourDirection.contactOwes, label: "Contact owes" },
  { value: FavourDirection.runnerOwes, label: "Runner owes" },
]

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

        <Stack direction="row">
          <group.AppField name="connection">
            {(field) => (
              <field.CounterField
                label="Connection"
                fullWidth
                size="small"
                min={RATING_MIN}
                max={RATING_MAX}
              />
            )}
          </group.AppField>

          <group.AppField name="loyalty">
            {(field) => (
              <field.CounterField
                label="Loyalty"
                fullWidth
                size="small"
                min={RATING_MIN}
                max={RATING_MAX}
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

        <group.AppField name="knowledgeSkills">
          {(field) => {
            const skills = field.state.value ?? []
            return (
              <Stack sx={{ gap: 0.5 }}>
                <Label label="Knowledge Skills" variant="outlined" />

                {skills.map((skill, index) => (
                  <Stack key={index} direction="row" sx={{ alignItems: "flex-start" }}>
                    <TextField
                      label="Skill"
                      size="small"
                      fullWidth
                      value={skill.name}
                      onChange={(e) => field.replaceValue(index, { ...skill, name: e.target.value })}
                    />
                    <TextField
                      label="Specialization (optional)"
                      size="small"
                      fullWidth
                      value={skill.specialization ?? ""}
                      onChange={(e) => field.replaceValue(index, { ...skill, specialization: e.target.value })}
                    />
                    <CounterInput
                      label="Rating"
                      size="small"
                      sx={{ minWidth: 90 }}
                      min={RATING_MIN}
                      max={RATING_MAX}
                      value={skill.rating}
                      onChange={(newValue) => field.replaceValue(index, { ...skill, rating: newValue ?? RATING_MIN })}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove skill"
                      onClick={() => field.removeValue(index)}
                    >
                      <RiDeleteBin6Line size={16} />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<RiAddLine />}
                  onClick={() => field.pushValue({ name: "", rating: 1 })}
                >
                  Add Skill
                </Button>
              </Stack>
            )
          }}
        </group.AppField>

        <group.AppField name="favours">
          {(field) => {
            const favours = field.state.value ?? []
            return (
              <Stack sx={{ gap: 0.5 }}>
                <Label label="Favours" variant="outlined" />

                {favours.map((favour, index) => (
                  <Stack key={index} direction="row" sx={{ alignItems: "flex-start" }}>
                    <TextField
                      label="Description"
                      size="small"
                      fullWidth
                      value={favour.description}
                      onChange={(e) => field.replaceValue(index, { ...favour, description: e.target.value })}
                    />
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Direction</InputLabel>
                      <Select
                        value={favour.direction}
                        label="Direction"
                        onChange={(e) => field.replaceValue(index, { ...favour, direction: e.target.value as FavourDirection })}
                      >
                        {favourDirectionOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove favour"
                      onClick={() => field.removeValue(index)}
                    >
                      <RiDeleteBin6Line size={16} />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<RiAddLine />}
                  onClick={() => field.pushValue({ description: "", direction: FavourDirection.contactOwes })}
                >
                  Add Favour
                </Button>
              </Stack>
            )
          }}
        </group.AppField>
      </>
    )
  },
})
