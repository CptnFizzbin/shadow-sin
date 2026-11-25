export interface BuilderState {
  nuyen: {
    starting: null | number
  }
}

export const builderStateFactory = (): BuilderState => {
  return {
    nuyen: {
      starting: null,
    },
  }
}
