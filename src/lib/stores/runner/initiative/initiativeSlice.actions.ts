import { createAction } from "@reduxjs/toolkit"

export const togglePass = createAction<number>("initiative/togglePass")
export const setRolledResults = createAction<number[]>("initiative/setRolledResults")
export const clearRolledResults = createAction("initiative/clearRolledResults")
export const setGoingFirst = createAction<boolean>("initiative/setGoingFirst")
export const gainExtraPass = createAction("initiative/gainExtraPass")
export const resetPasses = createAction("initiative/resetPasses")
