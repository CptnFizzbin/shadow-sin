/** The rate at which Runners buy karma with nuyen, set by the Table. */
export interface KarmaPurchaseRate {
  /** Nuyen a Runner pays for each point of karma bought. */
  nuyenPerKarma: number
}

/**
 * Settings a GM chooses once for every Runner at their Table. Its values are app-wide defaults
 * until Tables exist (see `docs/features/0003-gm-table.md`).
 */
export const GameTableService: { karmaPurchaseRate: KarmaPurchaseRate } = {
  karmaPurchaseRate: {
    nuyenPerKarma: 5000,
  },
}
