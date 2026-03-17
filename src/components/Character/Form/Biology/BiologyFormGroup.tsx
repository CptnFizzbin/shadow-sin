import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useStore } from "@tanstack/react-store";
import { type FC, useEffect, useRef } from "react";
import { getAttrBuildState } from "#/components/Character/Form/AttributeBuildState.ts";
import { BiologyAttributes } from "#/components/Character/Form/Biology/BiologyAttributes.tsx";
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm";
import { AttributeKey } from "#/lib/system/types/attributeKey";
import { awakenings, AwakeningType } from "#/lib/system/types/awakeningType.ts";
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts";

export interface BiologyFormGroupProps {
  form: PlayerCharacterForm;
}

export const BiologyFormGroup: FC<BiologyFormGroupProps> = ({ form }) => {
  const metatypeKey = useStore(form.store, (s) => s.values.metatype);
  const awakeningType = useStore(form.store, (s) => s.values.awakening);

  const prevAwakeningRef = useRef(awakeningType);

  useEffect(() => {
    if (metatypeKey === MetatypeKey.AI) {
      form.setFieldValue("awakening", AwakeningType.Mundane);
    }
  }, [metatypeKey, form]);

  useEffect(() => {
    form.setFieldValue("buildPoints.spent.attributes", 0);
    form.setFieldValue(`attributes`, (prev) => {
      const metatype = metatypes[metatypeKey];
      const awakening = awakenings[awakeningType];
      const attrs = { ...prev };

      const attrsToUpdate = Object.values(AttributeKey).filter(
        (attr) => attr !== AttributeKey.essence,
      );

      for (const attr of attrsToUpdate) {
        attrs[attr] = getAttrBuildState({
          value: metatype.attributes[attr].min,
          attr: attr,
          metatype: metatype,
          awakening: awakening,
        });
      }

      prevAwakeningRef.current = awakeningType;
      return attrs;
    });
  }, [metatypeKey, awakeningType, form]);

  return (
    <>
      <form.AppField
        name="metatype"
        children={(field) => (
          <field.SelectField
            label="Metatype"
            size="small"
            options={Object.values(metatypes).map(({ name, cost }) => {
              return {
                value: name,
                label: (
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width="100%"
                  >
                    <Typography>{name}</Typography>
                    <Typography variant={"subtitle2"} color="secondary.main">
                      {cost} BP
                    </Typography>
                  </Stack>
                ),
              };
            })}
          />
        )}
      />

      {metatypeKey !== MetatypeKey.AI && (
        <form.AppField
          name="awakening"
          children={(field) => (
            <field.SelectField
              label="Awakening"
              size="small"
              options={Object.values(awakenings).map(({ name, cost }) => {
                return {
                  value: name,
                  label: (
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      width="100%"
                    >
                      <Typography>{name}</Typography>
                      <Typography variant={"subtitle2"} color="secondary.main">
                        {cost} BP
                      </Typography>
                    </Stack>
                  ),
                };
              })}
            />
          )}
        />
      )}

      <BiologyAttributes form={form} />
    </>
  );
};
