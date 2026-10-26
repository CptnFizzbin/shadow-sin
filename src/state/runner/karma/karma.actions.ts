import { createAction } from "@reduxjs/toolkit"

import type { KarmaLedgerEntry, KarmaLedgerSource } from "#/system/model/karma/karmaLedgerEntry.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

const createLedgerEntry = (amount: number, description: string, source: KarmaLedgerSource): KarmaLedgerEntry => ({
  id: crypto.randomUUID() as UUID,
  timestamp: new Date().toISOString(),
  amount,
  description,
  source,
})

const requirePositiveAmount = (actionName: string, amount: number) => {
  if (amount <= 0) throw new Error(`${actionName} requires a positive amount, got ${amount}`)
}

const formatNuyenAmount = (nuyen: number) => `${nuyen.toLocaleString("en")}¥`

export const addKarma = createAction("karma/addKarma", (amount: number) => {
  requirePositiveAmount("addKarma", amount)
  const entry = createLedgerEntry(amount, `Added ${amount} karma`, "addKarma")
  return { payload: { amount, entry } }
})

export const spendKarma = createAction("karma/spendKarma", (amount: number) => {
  requirePositiveAmount("spendKarma", amount)
  return { payload: amount }
})

/**
 * Trades nuyen for karma: raises current karma by `amount` and withdraws `amount × nuyenPerKarma`
 * nuyen. Bought karma isn't earned, so the total earned is unchanged.
 */
export const buyKarma = createAction("karma/buyKarma", (amount: number, nuyenPerKarma: number) => {
  requirePositiveAmount("buyKarma", amount)
  const nuyenCost = amount * nuyenPerKarma
  const entry = createLedgerEntry(amount, `Bought ${amount} karma for ${formatNuyenAmount(nuyenCost)}`, "buyKarma")
  return { payload: { amount, nuyenCost, entry } }
})

/**
 * Trades karma for nuyen: lowers current karma by `amount` and deposits `amount × nuyenPerKarma`
 * nuyen. Throws from the reducer when the Runner has less than `amount` current karma.
 */
export const sellKarma = createAction("karma/sellKarma", (amount: number, nuyenPerKarma: number) => {
  requirePositiveAmount("sellKarma", amount)
  const nuyenGain = amount * nuyenPerKarma
  const entry = createLedgerEntry(-amount, `Sold ${amount} karma for ${formatNuyenAmount(nuyenGain)}`, "sellKarma")
  return { payload: { amount, nuyenGain, entry } }
})

/** A manual correction to a Runner's karma, outside the earn/spend rules. */
export interface KarmaAdjustment {
  /** Signed change to current karma. */
  currentDelta: number
  /** Signed change to the total karma earned. */
  totalDelta: number
  /** Why the change was made; recorded on the ledger entry. */
  reason?: string
}

const formatDelta = (delta: number) => (delta > 0 ? `+${delta}` : `${delta}`)

/**
 * Applies a {@link KarmaAdjustment}. Throws when both deltas are zero, and from the reducer when
 * the change would leave current or total karma negative.
 */
export const adjustKarma = createAction("karma/adjustKarma", (adjustment: KarmaAdjustment) => {
  const { currentDelta, totalDelta } = adjustment
  if (currentDelta === 0 && totalDelta === 0) throw new Error("adjustKarma requires a non-zero change")
  const changes = [
    currentDelta !== 0 && `current ${formatDelta(currentDelta)}`,
    totalDelta !== 0 && `total earned ${formatDelta(totalDelta)}`,
  ].filter(Boolean).join(", ")
  const reason = adjustment.reason?.trim()
  const description = reason ? `Adjusted karma (${changes}): ${reason}` : `Adjusted karma (${changes})`
  const entry = createLedgerEntry(currentDelta, description, "adjustKarma")
  return { payload: { currentDelta, totalDelta, entry } }
})
