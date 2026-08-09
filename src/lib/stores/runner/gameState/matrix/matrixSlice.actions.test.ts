import { describe, expect, it } from "vitest"

import { AccessLevel } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"

import {
  addKnownNode,
  clearActiveNode,
  removeKnownNode,
  setActiveNode,
  startActiveProgram,
  stopActiveProgram,
  updateKnownNode,
} from "./matrixSlice.actions.ts"
import { matrixReducer } from "./matrixSlice.ts"

const makeNode = (overrides: Partial<KnownNode> = {}): KnownNode => ({
  id: "node-1",
  name: "Renraku Arcology",
  matrix: { system: 4, firewall: 5, response: 3, signal: 6 },
  nodeType: NodeType.general,
  accessLevel: AccessLevel.public,
  ...overrides,
})

describe("addKnownNode", () => {
  it("appends the node with a freshly generated id", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, addKnownNode(makeNode({ id: "placeholder" })))

    // Assert
    expect(next.knownNodes).toHaveLength(1)
    expect(next.knownNodes[0].id).not.toBe("placeholder")
    expect(next.knownNodes[0].name).toBe("Renraku Arcology")
  })
})

describe("updateKnownNode", () => {
  it("replaces the matching node in place", () => {
    // Arrange
    const node = makeNode()
    const state = matrixReducer(undefined, addKnownNode(node))
    const [{ id }] = state.knownNodes

    // Act
    const next = matrixReducer(state, updateKnownNode({ ...node, id, name: "Renraku Tsurugi" }))

    // Assert
    expect(next.knownNodes).toHaveLength(1)
    expect(next.knownNodes[0].name).toBe("Renraku Tsurugi")
  })
})

describe("removeKnownNode", () => {
  it("removes the node", () => {
    // Arrange
    const state = matrixReducer(undefined, addKnownNode(makeNode()))
    const [{ id }] = state.knownNodes

    // Act
    const next = matrixReducer(state, removeKnownNode(id))

    // Assert
    expect(next.knownNodes).toHaveLength(0)
  })

  it("clears activeNodeId when the removed node was active", () => {
    // Arrange
    let state = matrixReducer(undefined, addKnownNode(makeNode()))
    const [{ id }] = state.knownNodes
    state = matrixReducer(state, setActiveNode(id))

    // Act
    const next = matrixReducer(state, removeKnownNode(id))

    // Assert — no auto-promotion of another node, per #440
    expect(next.activeNodeId).toBeUndefined()
  })

  it("leaves activeNodeId untouched when a different node is removed", () => {
    // Arrange
    let state = matrixReducer(undefined, addKnownNode(makeNode({ id: "placeholder-a", name: "Node A" })))
    const [{ id: activeId }] = state.knownNodes
    state = matrixReducer(state, setActiveNode(activeId))
    state = matrixReducer(state, addKnownNode(makeNode({ id: "placeholder-b", name: "Node B" })))
    const otherId = state.knownNodes.find((node) => node.id !== activeId)!.id

    // Act
    const next = matrixReducer(state, removeKnownNode(otherId))

    // Assert
    expect(next.activeNodeId).toBe(activeId)
  })

  it("cascades to remove ActivePrograms hosted on the deleted node", () => {
    // Arrange
    let state = matrixReducer(undefined, addKnownNode(makeNode()))
    const [{ id: nodeId }] = state.knownNodes
    state = matrixReducer(state, startActiveProgram({ sourceId: "program-1", nodeId }))

    // Act
    const next = matrixReducer(state, removeKnownNode(nodeId))

    // Assert
    expect(next.activePrograms).toHaveLength(0)
  })
})

describe("setActiveNode / clearActiveNode", () => {
  it("sets and clears the active node id", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const withActive = matrixReducer(state, setActiveNode("node-1"))
    const cleared = matrixReducer(withActive, clearActiveNode())

    // Assert
    expect(withActive.activeNodeId).toBe("node-1")
    expect(cleared.activeNodeId).toBeUndefined()
  })
})

describe("startActiveProgram / stopActiveProgram", () => {
  it("starts a program without duplicating an already-running (sourceId, nodeId) pair", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })
    const program = { sourceId: "program-1", nodeId: "node-1" }

    // Act
    const first = matrixReducer(state, startActiveProgram(program))
    const second = matrixReducer(first, startActiveProgram(program))

    // Assert
    expect(second.activePrograms).toEqual([program])
  })

  it("stops a running program", () => {
    // Arrange
    const program = { sourceId: "program-1", nodeId: "node-1" }
    const state = matrixReducer(undefined, startActiveProgram(program))

    // Act
    const next = matrixReducer(state, stopActiveProgram(program))

    // Assert
    expect(next.activePrograms).toHaveLength(0)
  })
})
