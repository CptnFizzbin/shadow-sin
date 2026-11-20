import { createFlagRegistry } from "./featureFlag.ts"

/** House Rules: app-invented design choices with no source book behind them. */
export const houseRules = createFlagRegistry("houseRules", {
  "items.licenseCheck.ratingPlusRating": {
    name: "License Check: Rating + Rating",
    description:
      "Roll rating × 2 dice for each side of a License Check's Opposed Test, instead of rating dice.",
    default: true,
  },
  "karma.buy.enabled": {
    name: "Buy Karma",
    description: "Allow buying karma with nuyen.",
    default: true,
  },
  "karma.buy.nuyenPerKarma": {
    name: "Karma Buy Rate",
    description: "Nuyen a Runner pays for each point of karma bought.",
    default: 5000,
  },
  "karma.sell.enabled": {
    name: "Sell Karma",
    description: "Allow selling karma for nuyen.",
    default: false,
  },
  "karma.sell.nuyenPerKarma": {
    name: "Karma Sell Rate",
    description: "Nuyen a Runner receives for each point of karma sold.",
    default: 2500,
  },
})
