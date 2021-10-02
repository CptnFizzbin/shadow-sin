import { Box } from '@mui/material'
import React, { FC } from 'react'

import { ContactData } from './ContactData'
import { ContactInfo } from './ContactInfo'

interface ContactListProps {
  contacts: ContactData[]
}

export const ContactList: FC<ContactListProps> = ({
  contacts,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {contacts.map(contact => (
        <ContactInfo key={contact.name} contact={contact} />
      ))}
    </Box>
  )
}
