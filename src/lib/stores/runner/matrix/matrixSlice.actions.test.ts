import { describe, expect, it } from "vitest"

import {
  setMatrixNodeFirewall,
  setMatrixNodeName,
  setMatrixNodeNumberOfPrograms,
  setMatrixNodeResponse,
  setMatrixNodeSignal,
  setMatrixNodeSystem,
} from "./matrixSlice.actions.ts"
import { matrixReducer } from "./matrixSlice.ts"

describe("setMatrixNodeName", () => {
  it("sets name to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeName("Fairlight Excalibur"))

    // Assert
    expect(next.name).toBe("Fairlight Excalibur")
  })
})

describe("setMatrixNodeSystem", () => {
  it("sets system to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeSystem(4))

    // Assert
    expect(next.system).toBe(4)
  })
})

describe("setMatrixNodeFirewall", () => {
  it("sets firewall to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeFirewall(5))

    // Assert
    expect(next.firewall).toBe(5)
  })
})

describe("setMatrixNodeResponse", () => {
  it("sets response to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeResponse(3))

    // Assert
    expect(next.response).toBe(3)
  })
})

describe("setMatrixNodeSignal", () => {
  it("sets signal to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeSignal(6))

    // Assert
    expect(next.signal).toBe(6)
  })
})

describe("setMatrixNodeNumberOfPrograms", () => {
  it("sets numberOfPrograms to the given value", () => {
    // Arrange
    const state = matrixReducer(undefined, { type: "@@INIT" })

    // Act
    const next = matrixReducer(state, setMatrixNodeNumberOfPrograms(2))

    // Assert
    expect(next.numberOfPrograms).toBe(2)
  })
})
