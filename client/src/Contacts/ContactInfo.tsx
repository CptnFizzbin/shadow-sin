import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import React, { FC } from 'react'

import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { Stat } from '../UI/StatBlock'
import { ContactData } from './ContactData'

interface ContactInfoProps {
  contact: ContactData
}

export const ContactInfo: FC<ContactInfoProps> = ({
  contact,
}) => {
  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    <Stat name="Loyalty" value={contact.loyalty} />
    <Stat name="Connection" value={contact.connection} />
  </Box>

  return (
    <InfoBlock title={contact.name} titleRight={blockTitleRight}>
      {contact.description && (
        <InfoSection>
          <Typography>{contact.description}</Typography>
        </InfoSection>
      )}
    </InfoBlock>
  )
}
