/** Nuyen-per-karma rates for trading karma, set by the Table. */
export interface KarmaExchangeRates {
  /** Nuyen a Runner pays for each point of karma bought. */
  buyNuyenPerKarma: number
  /** Nuyen a Runner receives for each point of karma sold. */
  sellNuyenPerKarma: number
}

/**
 * Settings a GM chooses once for every Runner at their Table. Its values are app-wide defaults
 * until Tables exist (see `docs/features/0003-gm-table.md`).
 */
export const GameTableService: { karmaExchangeRates: KarmaExchangeRates } = {
  karmaExchangeRates: {
    buyNuyenPerKarma: 5000,
    sellNuyenPerKarma: 2500,
  },
}
