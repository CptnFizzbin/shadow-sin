import { faSave, faWifi } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Stack } from "@mui/material"
import React, { FC } from "react"

import { RecordId } from "../../../Api/Model"
import { AttributeBlock } from "../../../UI/AttributeBlock"
import { AutosoftData } from "./AutosoftData"

interface AutosoftsListProps {
  autosofts: AutosoftData[]
  slavedIds?: RecordId[]
  withAvail?: boolean
  withCost?: boolean
}

export const AutosoftsList: FC<AutosoftsListProps> = ({
  autosofts,
  slavedIds,
}) => {
  return (
    <Stack gap={1} direction="row" flexWrap="wrap">
      {autosofts.map((autosoft) => (
        <Box key={autosoft.id}>
          <AutosoftListItem
            key={autosoft.id}
            autosoft={autosoft}
            slavedIds={slavedIds}
          />
        </Box>
      ))}
    </Stack>
  )
}

interface AutosoftListItemProps {
  autosoft: AutosoftData
  slavedIds?: RecordId[]
  withAvail?: boolean
  withCost?: boolean
}

const AutosoftListItem: FC<AutosoftListItemProps> = ({
  autosoft,
  slavedIds,
}) => {
  return (
    <Box minWidth={150}>
      <Box padding={0.5}>
        <Box sx={{ display: "inline-block", marginRight: 1 }}>
          <FontAwesomeIcon
            icon={slavedIds?.includes(autosoft.id) ? faWifi : faSave}
          />
        </Box>
        {autosoft.name}
      </Box>

      <AttributeBlock attributes={autosoft.attributes} vertical />
    </Box>
  )
}
