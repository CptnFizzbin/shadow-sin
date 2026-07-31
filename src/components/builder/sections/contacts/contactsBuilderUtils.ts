import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { ContactData } from "#/system/contactData.ts"

export const getContactBpCost = (contact: ContactData): number => {
  return (
    contact.connection * BuilderConfig.contacts.bpCost.perConnection
    + contact.loyalty * BuilderConfig.contacts.bpCost.perLoyalty
  )
}
