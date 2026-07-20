export interface Combatant {
  id: string
  name: string
  isPC: boolean
  score: number
  totalPasses: number
  passesCompleted: number[]
}

export const MOCK_COMBATANTS: Combatant[] = [
  { id: "wraith", name: "Wraith", isPC: true, score: 18, totalPasses: 3, passesCompleted: [] },
  { id: "doc", name: "Doc Holliday", isPC: true, score: 14, totalPasses: 2, passesCompleted: [] },
  { id: "drone", name: "Rigger's Drone", isPC: false, score: 16, totalPasses: 2, passesCompleted: [] },
  { id: "trooper-1", name: "Ares Trooper #1", isPC: false, score: 11, totalPasses: 1, passesCompleted: [] },
  { id: "trooper-2", name: "Ares Trooper #2", isPC: false, score: 9, totalPasses: 1, passesCompleted: [] },
]
