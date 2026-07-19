export enum FavourDirection {
  contactOwes = "contactOwes",
  runnerOwes = "runnerOwes",
}

export interface FavourData {
  description: string
  direction: FavourDirection
}
