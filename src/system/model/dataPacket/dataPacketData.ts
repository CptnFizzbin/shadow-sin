import { z } from "zod"

import type { ContactData } from "#/system/model/contacts/contactData.ts"
import { ContactDataSchema } from "#/system/model/contacts/contactData.ts"

/** The `_meta_.type` discriminator that marks a file as a Data Packet rather than a whole Runner. */
export const DataPacketType = "dataPacket"

/**
 * A partial fragment of Runner data, shared as a `.sind` file, that a Player merges atop one of
 * their existing Runners. Every section is optional — a packet carries only what it adds.
 */
export interface DataPacketData {
  _meta_: {
    type: typeof DataPacketType
  }
  contacts?: ContactData[]
}

/** Matches any file whose `_meta_` marks it as a Data Packet, without validating its sections. */
export const DataPacketMetaSchema = z.object({
  _meta_: z.object({
    type: z.literal(DataPacketType),
  }),
})

export const DataPacketDataSchema = DataPacketMetaSchema.extend({
  contacts: z.array(ContactDataSchema).optional(),
}) satisfies z.ZodType<DataPacketData>
