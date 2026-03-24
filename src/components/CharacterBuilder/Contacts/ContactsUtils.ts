import type { ContactData } from "#/lib/system/types/contactData.ts"

export const ContactCostPerConnection = 1
export const ContactCostPerLoyalty = 1

export const getContactBpCost = (contact: ContactData): number => {
  return (
    contact.connection * ContactCostPerConnection
    + contact.loyalty * ContactCostPerLoyalty
  )
}
