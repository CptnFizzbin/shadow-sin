import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { AttrDecrementButton } from "#/components/CharacterBuilder/Attributes/AttrDecrementButton.tsx"
import { AttrIncrementButton } from "#/components/CharacterBuilder/Attributes/AttrIncrementButton.tsx"
import { useAttrApi } from "#/components/CharacterBuilder/Attributes/UseAttrApi.ts"
import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttributeRowProps {
  attr: AttributeKey
}

export const AttributeRow: FC<AttributeRowProps> = (props) => {
  const store = useCharacterBuilderStoreContext()
  const attribute = useAttrApi(props.attr, store)

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <AttrDecrementButton {...props} />

      <Grid container columns={2} sx={{ flexGrow: 1 }}>
        <Grid size={1}>
          <Typography sx={{ textAlign: "center" }}>
            {attribute.label}:
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
            {attribute.value} / {attribute.max}
          </Typography>
        </Grid>
      </Grid>

      <AttrIncrementButton {...props} />
    </Stack>
  )
}
