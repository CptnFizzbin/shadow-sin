import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import type { ContactData } from "#/system/contactData.ts"

/** @deprecated Use `BuilderConfig.contacts.bpCost.perConnection` instead. */
export const ContactCostPerConnection = BuilderConfig.contacts.bpCost.perConnection
/** @deprecated Use `BuilderConfig.contacts.bpCost.perLoyalty` instead. */
export const ContactCostPerLoyalty = BuilderConfig.contacts.bpCost.perLoyalty

export const getContactBpCost = (contact: ContactData): number => {
  return (
    contact.connection * BuilderConfig.contacts.bpCost.perConnection
    + contact.loyalty * BuilderConfig.contacts.bpCost.perLoyalty
  )
}
