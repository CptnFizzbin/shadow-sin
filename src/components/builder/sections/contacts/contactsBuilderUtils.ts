import type { ContactData } from "#/system/contactData.ts"

const ContactCostPerConnection = 1
const ContactCostPerLoyalty = 1

export const getContactBpCost = (contact: ContactData): number => {
  return (
    contact.connection * ContactCostPerConnection
    + contact.loyalty * ContactCostPerLoyalty
  )
}
