import { createFlagRegistry } from "./featureFlag.ts"

/** House Rules: app-invented design choices with no source book behind them. */
export const houseRules = createFlagRegistry("houseRules", {
  "items.licenseCheck.ratingPlusRating": {
    name: "License Check: Rating + Rating",
    description:
      "Roll rating × 2 dice for each side of a License Check's Opposed Test, instead of rating dice.",
    default: true,
  },
  "karma.nuyenExchange": {
    name: "Karma–Nuyen Exchange",
    description: "Allow buying karma with nuyen and selling karma for nuyen.",
    default: true,
  },
})
