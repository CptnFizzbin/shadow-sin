import { createAction } from "@reduxjs/toolkit"

export const setMatrixNodeName = createAction<string>("matrix/setName")
export const setMatrixNodeSystem = createAction<number>("matrix/setSystem")
export const setMatrixNodeFirewall = createAction<number>("matrix/setFirewall")
export const setMatrixNodeResponse = createAction<number>("matrix/setResponse")
export const setMatrixNodeSignal = createAction<number>("matrix/setSignal")
export const setMatrixNodeNumberOfPrograms = createAction<number>("matrix/setNumberOfPrograms")
