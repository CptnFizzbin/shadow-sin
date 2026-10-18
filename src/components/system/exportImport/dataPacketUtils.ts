import { dump, load } from "js-yaml"

import type { DataPacketData } from "#/system/model/dataPacket/dataPacketData.ts"
import { DataPacketDataSchema, DataPacketMetaSchema, DataPacketType } from "#/system/model/dataPacket/dataPacketData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { yamlToRunnerData } from "./exportUtils.ts"

/** File extension for an exported Data Packet. */
export const DataPacketExtension = "sind"

/** The contents of an imported file: either a whole Runner, or a Data Packet to merge atop one. */
export type ImportedFile =
  | { kind: "runner", runner: RunnerData }
  | { kind: "dataPacket", packet: DataPacketData }

/** Builds a Data Packet carrying `contacts`. */
export function contactsDataPacket(contacts: DataPacketData["contacts"]): DataPacketData {
  return { _meta_: { type: DataPacketType }, contacts }
}

/** Serialises a Data Packet to a YAML string. */
export function dataPacketToYaml(packet: DataPacketData): string {
  return dump(packet, { lineWidth: 120 })
}

/**
 * Parses a YAML file's contents as either a Runner or a Data Packet, telling them apart by the
 * `_meta_.type` discriminator. Throws if the contents are not valid YAML or fail validation.
 */
export function parseImportedYaml(yamlContent: string): ImportedFile {
  const parsed: unknown = load(yamlContent)

  if (DataPacketMetaSchema.safeParse(parsed).success) {
    return { kind: "dataPacket", packet: DataPacketDataSchema.parse(parsed) }
  }

  return { kind: "runner", runner: yamlToRunnerData(yamlContent) }
}
