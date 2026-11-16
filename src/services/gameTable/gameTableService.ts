/** Nuyen-per-karma rates for trading karma, set by the Table. */
export interface KarmaExchangeRates {
  /** Nuyen a Runner pays for each point of karma bought. */
  buyNuyenPerKarma: number
  /** Nuyen a Runner receives for each point of karma sold. */
  sellNuyenPerKarma: number
}

/** Optional features a Table can switch on or off for every Runner at it. */
export interface GameTableFeatures {
  /** Runners can trade karma for nuyen at `KarmaExchangeRates.sellNuyenPerKarma`. */
  karmaSelling: boolean
}

/**
 * Settings a GM chooses once for every Runner at their Table. Its values are app-wide defaults
 * until Tables exist (see `docs/features/0003-gm-table.md`).
 */
export const GameTableService: { karmaExchangeRates: KarmaExchangeRates, features: GameTableFeatures } = {
  karmaExchangeRates: {
    buyNuyenPerKarma: 5000,
    sellNuyenPerKarma: 2500,
  },
  features: {
    karmaSelling: false,
  },
}
