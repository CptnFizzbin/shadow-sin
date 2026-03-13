import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export interface RunnerAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  charisma: number;
  intuition: number;
  logic: number;
  willpower: number;
  edge: number;
  essence: number;
  magic?: number;
  resonance?: number;
}

export type SkillCategory = "active" | "knowledge" | "language";

export interface RunnerSkill {
  name: string;
  rating: number;
  category: SkillCategory;
  linkedAttribute: AttributeKey;
  specialization?: string;
  notes?: string;
}

export interface WeaponProfile {
  id: string;
  name: string;
  category: "melee" | "firearm" | "heavy" | "thrown";
  skill: string;
  linkedAttribute: AttributeKey;
  damage: string;
  ap: string;
  mode?: string;
  ammo?: string;
  reach?: number;
  notes?: string;
}

export interface ArmorPiece {
  id: string;
  name: string;
  ballistic: number;
  impact: number;
  equipped?: boolean;
  notes?: string;
}

export interface GearItem {
  id: string;
  name: string;
  category:
    | "gear"
    | "cyberware"
    | "bioware"
    | "electronics"
    | "lifestyle"
    | "magic";
  rating?: number;
  cost?: number;
  availability?: string;
  notes?: string;
}

export interface VehicleProfile {
  id: string;
  name: string;
  type: string;
  handling: string;
  speed: string;
  armor: number;
  sensor: number;
  notes?: string;
}

export interface ContactProfile {
  id: string;
  name: string;
  role: string;
  connection: number;
  loyalty: number;
  notes?: string;
}

export interface SpellProfile {
  id: string;
  name: string;
  category: string;
  type: string;
  range: string;
  damage?: string;
  drain: string;
  notes?: string;
}

export interface LedgerEntry {
  id: string;
  label: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface LifestyleProfile {
  tier: string;
  monthlyCost: number;
  notes?: string;
}

export type Verification = { kind: "real" } | { kind: "fake"; rating: number };

export interface LicenseProfile {
  id: string;
  name: string;
  type: string;
  verification: Verification;
  notes?: string;
}

export interface SinProfile {
  id: string;
  name: string;
  type: string;
  verification: Verification;
  licenses: LicenseProfile[];
  notes?: string;
}

export interface RunnerCharacter {
  id: string;
  alias: string;
  realName: string;
  metatype: string;
  archetype: string;
  awakening: AwakeningType;
  tradition?: string;
  homeNode?: string;
  attributes: RunnerAttributes;
  skills: RunnerSkill[];
  qualities: string[];
  contacts: ContactProfile[];
  sins: SinProfile[];
  weapons: WeaponProfile[];
  armor: ArmorPiece[];
  gear: GearItem[];
  vehicles: VehicleProfile[];
  spells: SpellProfile[];
  karmaLog: LedgerEntry[];
  nuyenLog: LedgerEntry[];
  currentEdge?: number;
  damage: {
    physical: number;
    stun: number;
  };
  lifestyle: LifestyleProfile;
  notes: string[];
}
