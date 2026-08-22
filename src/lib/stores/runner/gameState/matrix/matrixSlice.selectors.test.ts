import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import { AccessLevel } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import {
  MatrixSelectors,
  selectActiveNode,
  selectActiveNodeId,
  selectActivePrograms,
  selectKnownNodes,
} from "./matrixSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

const node: KnownNode = {
  kind: EntityKind.matrixNode,
  id: "node-1",
  name: "Renraku Arcology",
  matrix: { system: 4 },
  nodeType: NodeType.general,
  accessLevel: AccessLevel.public,
}

describe("matrixSlice selectors", () => {
  it("selects known nodes and active programs", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = {
        knownNodes: [node],
        activePrograms: [{ sourceId: "program-1", nodeId: "node-1" }],
      }
      return data
    })

    // Act / Assert
    expect(selectKnownNodes(sheet)).toEqual([node])
    expect(selectActivePrograms(sheet)).toEqual([{ sourceId: "program-1", nodeId: "node-1" }])
  })

  it("selects the active node id and resolved node", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = { knownNodes: [node], activeNodeId: "node-1", activePrograms: [] }
      return data
    })

    // Act / Assert
    expect(selectActiveNodeId(sheet)).toBe("node-1")
    expect(selectActiveNode(sheet)).toEqual(node)
  })

  it("returns undefined for the active node when nothing is active", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = { knownNodes: [node], activePrograms: [] }
      return data
    })

    // Act / Assert
    expect(selectActiveNodeId(sheet)).toBeUndefined()
    expect(selectActiveNode(sheet)).toBeUndefined()
  })
})

describe("MatrixSelectors", () => {
  it("selects known nodes and active programs", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = {
        knownNodes: [node],
        activePrograms: [{ sourceId: "program-1", nodeId: "node-1" }],
      }
      return data
    })

    // Act / Assert
    expect(MatrixSelectors.selectKnownNodes(stateFor(sheet))).toEqual([node])
    expect(MatrixSelectors.selectActivePrograms(stateFor(sheet))).toEqual([{ sourceId: "program-1", nodeId: "node-1" }])
  })

  it("selects the active node id and resolved node", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = { knownNodes: [node], activeNodeId: "node-1", activePrograms: [] }
      return data
    })

    // Act / Assert
    expect(MatrixSelectors.selectActiveNodeId(stateFor(sheet))).toBe("node-1")
    expect(MatrixSelectors.selectActiveNode(stateFor(sheet))).toEqual(node)
  })

  it("returns undefined for the active node when nothing is active", () => {
    // Arrange
    const sheet = runnerDataFactory((data) => {
      data.gameState.matrix = { knownNodes: [node], activePrograms: [] }
      return data
    })

    // Act / Assert
    expect(MatrixSelectors.selectActiveNodeId(stateFor(sheet))).toBeUndefined()
    expect(MatrixSelectors.selectActiveNode(stateFor(sheet))).toBeUndefined()
  })
})
