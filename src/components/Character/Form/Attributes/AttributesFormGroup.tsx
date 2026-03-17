import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import { AttributeRow } from "#/components/Character/Form/Attributes/AttributeRow.tsx";
import {
  attrPointCosts,
  useAttributeFormGroup,
} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts";
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts";
import {
  AttributeKey,
  AttributeOrder,
} from "#/lib/system/types/attributeKey.ts";

export interface AttributesFormGroupProps {
  form: PlayerCharacterForm;
}

export const AttributesFormGroup: FC<AttributesFormGroupProps> = ({ form }) => {
  const { bpSpent, attributes } = useAttributeFormGroup(form);

  const attrRows = AttributeOrder.filter((key) => key !== AttributeKey.essence)
    .map((attr) => ({ attr, ...attributes[attr] }))
    .filter(({ min }) => min >= 1)
    .map(({ attr }) => attr);

  return (
    <Stack gap={1}>
      <Typography variant="caption">
        {bpSpent} / {attrPointCosts.allowance} BP
      </Typography>

      <LinearProgress
        variant="determinate"
        value={Math.min(
          100,
          Math.round((bpSpent / attrPointCosts.allowance) * 100),
        )}
      />

      <Stack gap={0.5}>
        {attrRows.map((attr) => (
          <AttributeRow key={attr} form={form} attr={attr} />
        ))}
      </Stack>
    </Stack>
  );
};
