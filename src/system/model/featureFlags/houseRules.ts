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
    description: "Allow trading between karma and nuyen.",
    default: true,
  },
  "karma.selling": {
    name: "Karma Selling",
    description: "Allow selling karma for nuyen, on top of buying it, while the Karma–Nuyen Exchange is on.",
    default: false,
  },
})
