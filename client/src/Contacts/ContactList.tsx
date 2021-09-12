import { Box, Typography } from '@material-ui/core'
import { FC } from 'react'

import { AttrList } from '../System/Attribute'
import { AttributeBlock } from '../UI/AttributeBlock'
import { ContactData } from './ContactData'

interface ContactListProps {
  contacts: ContactData[]
}

export const ContactList: FC<ContactListProps> = ({
  contacts,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      {contacts.map(contact => (
        <Box key={contact.name}>
          <ContactListItem contact={contact} />
        </Box>
      ))}
    </Box>
  )
}

interface ContactListItemProps {
  contact: ContactData
}

export const ContactListItem: FC<ContactListItemProps> = ({
  contact,
}) => {
  const attributes: AttrList = {
    'Loyalty': contact.loyalty,
    'Connection': contact.connection,
  }

  return (
    <Box>
      <Typography variant="body1">{contact.name}</Typography>
      <Typography variant="caption">{contact.description}</Typography>
      <AttributeBlock attributes={attributes} />
    </Box>
  )
}
