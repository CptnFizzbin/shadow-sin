import type { ContactData } from "#/data/contacts/contactData.ts"

import { BuilderConfig } from "./builderConfig.ts"

export const getContactBpCost = (contact: ContactData): number => {
  return (
    contact.connection * BuilderConfig.contacts.bpCost.perConnection
    + contact.loyalty * BuilderConfig.contacts.bpCost.perLoyalty
  )
}
