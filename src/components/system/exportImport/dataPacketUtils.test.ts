import { describe, expect, it } from "vitest"

import type { ContactData } from "#/system/model/contacts/contactData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { contactsDataPacket, dataPacketToYaml, parseImportedYaml } from "./dataPacketUtils.ts"
import { runnerDataToYaml } from "./exportUtils.ts"

const contact: ContactData = {
  id: "5b0d2d0e-3f1c-4a8e-9b7a-2f6c1d9e4a10",
  name: "Mama Hu",
  connection: 4,
  loyalty: 2,
  notes: "Runs a noodle shop in the Barrens",
}

describe.concurrent("parseImportedYaml", () => {
  it("round-trips an exported contacts data packet", () => {
    // Arrange
    const yamlContent = dataPacketToYaml(contactsDataPacket([contact]))

    // Act
    const imported = parseImportedYaml(yamlContent)

    // Assert
    expect(imported).toEqual({ kind: "dataPacket", packet: contactsDataPacket([contact]) })
  })

  it("writes the data packet type into the file's meta", () => {
    // Arrange / Act
    const yamlContent = dataPacketToYaml(contactsDataPacket([contact]))

    // Assert
    expect(yamlContent).toMatch(/^_meta_:\n {2}type: dataPacket\n/)
  })

  it("parses a hand-written packet with no optional sections", () => {
    // Arrange
    const yamlContent = "_meta_:\n  type: dataPacket\n"

    // Act
    const imported = parseImportedYaml(yamlContent)

    // Assert
    expect(imported).toEqual({ kind: "dataPacket", packet: { _meta_: { type: "dataPacket" } } })
  })

  it("rejects a data packet whose contacts are malformed", () => {
    // Arrange
    const yamlContent = "_meta_:\n  type: dataPacket\ncontacts:\n  - name: No Id\n"

    // Act / Assert
    expect(() => parseImportedYaml(yamlContent)).toThrow()
  })

  it("parses a runner export as a runner", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const imported = parseImportedYaml(runnerDataToYaml(runner))

    // Assert
    expect(imported.kind).toBe("runner")
  })
})
