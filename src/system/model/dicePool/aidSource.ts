/** Help another character or a spirit gives a test, adding dice to the pool of the one rolling it. */
export type AidSource = TeamworkAid | SpiritAid

/**
 * An assistant in a Teamwork Test: each hit on the assistant's own test adds one die to the
 * leader's pool.
 */
export interface TeamworkAid {
  kind: "teamwork"
  /** Who is assisting, as shown on the pool. */
  name: string
  hits: number
}

/** A spirit using an aid power on the test, adding dice equal to its Force. */
export interface SpiritAid {
  kind: "spirit"
  /** The spirit's name, as shown on the pool. */
  name: string
  force: number
}
