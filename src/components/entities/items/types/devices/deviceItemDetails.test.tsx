import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { isAgentData } from "#/system/model/items/agentData.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import { AccessLevel } from "#/system/model/matrix/accessLevel.ts"
import type { ActiveProgram } from "#/system/model/matrix/activeProgram.ts"
import type { KnownNode } from "#/system/model/matrix/knownNode.ts"
import { NodeType } from "#/system/model/matrix/nodeType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { makeAgent } from "#testUtils/fixtures/makeAgent.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { DeviceItemDetails } from "./deviceItemDetails.tsx"

const commlink: DeviceData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000010",
  name: "Hermes Ikon",
  itemType: ItemType.device,
}

const browse: ProgramData = {
  kind: EntityKind.item,
  items: { parentId: commlink.id, childIds: [] },
  id: "00000000-0000-0000-0000-000000000011",
  name: "Browse",
  itemType: ItemType.program,
  rating: 4,
  programType: ProgramType.browse,
}

const agent = makeAgent({
  id: "00000000-0000-0000-0000-000000000012",
  items: { parentId: commlink.id, childIds: [] },
})

const trodes: ItemData = {
  kind: EntityKind.item,
  items: { parentId: commlink.id, childIds: [] },
  id: "00000000-0000-0000-0000-000000000013",
  name: "Trodes",
  itemType: ItemType.other,
}

const arcologyNode: KnownNode = {
  kind: EntityKind.matrixNode,
  id: "node-1",
  name: "Renraku Arcology",
  matrix: { system: 4, firewall: 5, response: 3, signal: 6 },
  nodeType: NodeType.general,
  accessLevel: AccessLevel.user,
}

function renderDevice(knownNodes: KnownNode[] = [], activePrograms: ActiveProgram[] = []) {
  const device = { ...commlink, items: { parentId: null, childIds: [browse.id, agent.id, trodes.id] } }
  const runner = runnerDataFactory({
    items: { [device.id]: device, [browse.id]: browse, [agent.id]: agent, [trodes.id]: trodes },
    afterBuild: (data) => {
      data.gameState.matrix = { knownNodes, activePrograms }
    },
  })

  return renderWithProviders(<DeviceItemDetails device={device} />, { runner })
}

/** Makes every media query miss, so `useMediaQuery(theme.breakpoints.up("md"))` reports a phone-width viewport. */
function stubNarrowViewport() {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe("DeviceItemDetails", () => {
  afterEach(() => vi.restoreAllMocks())

  it("shows Loaded and Running side by side on wide viewports", () => {
    // Arrange / Act
    renderDevice()

    // Assert
    expect(screen.queryByRole("tab")).toBeNull()
    expect(screen.getByText("Loaded")).toBeDefined()
    expect(screen.getByText("Running")).toBeDefined()
    expect(screen.getByText("Nothing running")).toBeDefined()
  })

  it("lists loaded Programs and Agents apart from other attachments, on a Loaded tab on narrow viewports", () => {
    // Arrange
    stubNarrowViewport()

    // Act
    renderDevice()

    // Assert
    expect(screen.getByRole("tab", { name: "Loaded", selected: true })).toBeDefined()
    expect(screen.getAllByRole("button", { name: "Run" })).toHaveLength(2)
    expect(screen.getByRole("button", { name: "Add Program" })).toBeDefined()
    expect(screen.getByRole("button", { name: "Add Agent" })).toBeDefined()
    expect(screen.getByText("Trodes")).toBeDefined()
    expect(screen.getByRole("button", { name: "Add Item" })).toBeDefined()
  })

  it("adds an Agent loaded on the device", async () => {
    // Arrange
    const store = renderDevice()

    // Act: item details are Viewer-only, so a new item's dialog offers Acquire/Purchase, not Save.
    fireEvent.click(screen.getByRole("button", { name: "Add Agent" }))
    const dialog = await screen.findByRole("dialog")
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Watchdog" } })
    fireEvent.click(within(dialog).getByRole("button", { name: "Acquire" }))

    // Assert
    await waitFor(() => {
      const watchdog = Object.values(store.getState().items).find(({ name }) => name === "Watchdog")
      expect(watchdog && isAgentData(watchdog)).toBe(true)
      expect(watchdog?.items.parentId).toBe(commlink.id)
    })
  })

  it("lists running Programs with their Known Node on the Running tab", () => {
    // Arrange
    stubNarrowViewport()
    renderDevice([arcologyNode], [{ sourceId: browse.id, nodeId: arcologyNode.id }])

    // Act
    fireEvent.click(screen.getByRole("tab", { name: "Running" }))

    // Assert
    expect(screen.getByText(/Renraku Arcology/)).toBeDefined()
    expect(screen.getByRole("button", { name: "Terminate" })).toBeDefined()
  })

  it("terminates a running Program", () => {
    // Arrange
    stubNarrowViewport()
    const store = renderDevice([arcologyNode], [{ sourceId: browse.id, nodeId: arcologyNode.id }])
    fireEvent.click(screen.getByRole("tab", { name: "Running" }))

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Terminate" }))

    // Assert
    expect(store.getState().runner.gameState.matrix.activePrograms).toEqual([])
    expect(screen.getByText("Nothing running")).toBeDefined()
  })

  it("runs a Program on a chosen Known Node", async () => {
    // Arrange
    const store = renderDevice([arcologyNode])

    // Act
    fireEvent.click(screen.getAllByRole("button", { name: "Run" })[0])
    const dialog = await screen.findByRole("dialog")
    fireEvent.click(within(dialog).getByRole("radio", { name: /Renraku Arcology/ }))
    fireEvent.click(within(dialog).getByRole("button", { name: "Run" }))

    // Assert
    await waitFor(() => {
      expect(store.getState().runner.gameState.matrix.activePrograms).toEqual([
        { sourceId: browse.id, nodeId: arcologyNode.id },
      ])
    })
  })

  it("adds a new Known Node and runs the Program on it", async () => {
    // Arrange
    const store = renderDevice()

    // Act
    fireEvent.click(screen.getAllByRole("button", { name: "Run" })[1])
    const dialog = await screen.findByRole("dialog")
    fireEvent.change(within(dialog).getByLabelText(/Name/), { target: { value: "Stuffer Shack" } })
    fireEvent.click(within(dialog).getByRole("button", { name: "Run" }))

    // Assert
    await waitFor(() => {
      const { knownNodes, activePrograms } = store.getState().runner.gameState.matrix
      expect(knownNodes.map((node) => node.name)).toEqual(["Stuffer Shack"])
      expect(activePrograms).toEqual([{ sourceId: agent.id, nodeId: knownNodes[0].id }])
    })
  })
})
