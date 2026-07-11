export class RunnerNotFoundError extends Error {
  public constructor(id: string) {
    super(`Runner not found: ${id}`)
    this.name = "RunnerNotFoundError"
  }
}
