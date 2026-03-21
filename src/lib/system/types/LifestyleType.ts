export enum LifestyleType {
  Street = "Street",
  Squatter = "Squatter",
  Low = "Low",
  Middle = "Middle",
  High = "High",
  Luxury = "Luxury",
}

export interface LifestyleData {
  name: LifestyleType
  upkeep: number
  starting: {
    numDice: number
    mult: number
  }
}

export const Lifestyles: Record<LifestyleType, LifestyleData> = {
  Street: {
    name: LifestyleType.Street,
    upkeep: 0,
    starting: {
      numDice: 1,
      mult: 10,
    },
  },
  Squatter: {
    name: LifestyleType.Squatter,
    upkeep: 500,
    starting: {
      numDice: 2,
      mult: 20,
    },
  },
  Low: {
    name: LifestyleType.Low,
    upkeep: 2_000,
    starting: {
      numDice: 3,
      mult: 50,
    },
  },
  Middle: {
    name: LifestyleType.Middle,
    upkeep: 5_000,
    starting: {
      numDice: 4,
      mult: 100,
    },
  },
  High: {
    name: LifestyleType.High,
    upkeep: 10_000,
    starting: {
      numDice: 4,
      mult: 500,
    },
  },
  Luxury: {
    name: LifestyleType.Luxury,
    upkeep: 100_000,
    starting: {
      numDice: 4,
      mult: 1_000,
    },
  },
}
