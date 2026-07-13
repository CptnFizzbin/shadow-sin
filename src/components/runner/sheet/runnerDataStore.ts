import { Store } from "@tanstack/store"

import type { RunnerData } from "#/system/runnerData.ts"

export class RunnerDataStore extends Store<RunnerData> {
  set(data: RunnerData): void {
    this.setState(() => data)
  }
}
