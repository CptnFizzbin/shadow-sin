import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import React, { FC } from "react"

import { SimpleInfoBlock } from "../UI/InfoBlock/SimpleInfoBlock"
import { Stat } from "../UI/StatBlock"
import { ContactData } from "./ContactData"

interface ContactInfoProps {
  contact: ContactData
}

export const ContactInfo: FC<ContactInfoProps> = ({ contact }) => {
  const blockTitleRight = (
    <Box sx={{ fontSize: 10, textAlign: "right" }}>
      <Stat name="Loyalty" value={contact.loyalty} />
      <Stat name="Connection" value={contact.connection} />
    </Box>
  )

  return (
    <SimpleInfoBlock name={contact.name} attributes={blockTitleRight}>
      <Typography variant="caption">{contact.description}</Typography>
    </SimpleInfoBlock>
  )
}
