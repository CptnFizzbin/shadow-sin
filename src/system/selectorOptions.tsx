import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"

import { AttributeKey, AttributeLabels, MentalAttributes, PhysicalAttributes } from "./attributeKey.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "./gear/implantData.ts"
import { ProgramType } from "./gear/programData.ts"
import { FirearmAttachmentPoint, MeleeWeaponType, WeaponType } from "./gear/weaponData.ts"
import { firearmTypes } from "./gear/weapons/firearms/firearmTypeInfo.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "./magic/spellData.ts"
import { SpiritType, SpiritTypeLabels } from "./magic/spiritData.ts"
import { AccessLevel, AccessLevelLabels } from "./matrix/accessLevel.ts"
import { NodeType, NodeTypeLabels } from "./matrix/nodeType.ts"
import { skillList } from "./skills/skillList.ts"
import type { BookKey } from "./sourceData.ts"
import { books } from "./sourceData.ts"

const splitCamelCase = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
const titleCase = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

/**
 * Every static `SelectField` option list used across the app, gathered in one place under a
 * single namespace so option sets aren't redefined ad hoc (and potentially drift, typo, or
 * collide by variable name) in each form's fields file.
 *
 * Only fixed, data-driven lists live here — an option list whose *contents* depend on component
 * props/state (e.g. a tradition-filtered spirit list, or a "Native" entry disabled based on other
 * runner state) stays local to its component, though it may still draw its full/fallback set from
 * here (see `SpiritFormFields`).
 */
export const SelectorOptions = {
  accessLevel: Object.values(AccessLevel).map((value) => ({ value, label: AccessLevelLabels[value] })),

  ammoType: [
    { label: "Break-action", value: "break" },
    { label: "Clip", value: "clip" },
    { label: "Drum", value: "drum" },
    { label: "Muzzle-loader", value: "muzzle" },
    { label: "Magazine", value: "magazine" },
    { label: "Cylinder", value: "cylinder" },
    { label: "Belt", value: "belt" },
  ],

  book: Object.entries(books).map(([key, value]) => ({ value: key as BookKey, ...value })),

  deviceType: [
    { label: "Commlink", value: "commlink" },
    { label: "Other", value: "other" },
  ],

  drainAttribute: [...PhysicalAttributes, ...MentalAttributes].map(
    (key) => ({ value: key, label: AttributeLabels[key] }),
  ),

  firearmAttachmentPoint: [
    { label: "Top", value: FirearmAttachmentPoint.Top },
    { label: "Barrel", value: FirearmAttachmentPoint.Barrel },
    { label: "Under", value: FirearmAttachmentPoint.Under },
  ],

  firearmType: Object.entries(firearmTypes).map(([type, value]) => ({
    label: type,
    value: type,
    group: value.weaponGroup,
  })),

  firingMode: [
    { label: "Single Shot", value: "SS" },
    { label: "Semi Auto", value: "SA" },
    { label: "Burst Fire", value: "B" },
    { label: "Full Auto", value: "FA" },
  ],

  implantGrade: [
    {
      label: (
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}
        >
          <Box>Standard</Box>
          {" "}
          <Typography color="text.secondary">
            ×1 ¥ | ×1.0 Ess
          </Typography>
        </Stack>
      ),
      value: ImplantGrade.standard,
    },
    {
      label: (
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}
        >
          <Box>Alpha</Box>
          {" "}
          <Typography color="text.secondary">
            ×2 ¥ | ×0.8 Ess
          </Typography>
        </Stack>
      ),
      value: ImplantGrade.alpha,
    },
  ],

  implantLocation: Object.values(ImplantLocation).map((location) => ({ label: location, value: location })),

  implantType: [
    { label: "Cyberware", value: ImplantType.cyberware },
    { label: "Bioware", value: ImplantType.bioware },
  ],

  meleeWeaponType: [
    { label: "Blade", value: MeleeWeaponType.blade },
    { label: "Club", value: MeleeWeaponType.club },
  ],

  nodeType: Object.values(NodeType).map((value) => ({ value, label: NodeTypeLabels[value] })),

  programType: Object.values(ProgramType).map((programType) => ({
    label: titleCase(splitCamelCase(programType)),
    value: programType,
  })),

  spellCategory: Object.values(SpellCategory).map((value) => ({ label: value, value })),

  spellDamage: Object.values(SpellDamage).map((value) => ({ label: value, value })),

  spellDrainType: [
    { label: "Force ÷ 2", value: SpellDrainType.Force },
    { label: "Fixed", value: SpellDrainType.Fixed },
  ],

  spellDuration: Object.values(SpellDuration).map((value) => ({ label: value, value })),

  spellRange: [
    { label: "Touch", value: SpellRange.Touch },
    { label: "Line of Sight", value: SpellRange.LoS },
    { label: "Line of Sight (Area)", value: SpellRange.LoSArea },
  ],

  spellType: Object.values(SpellType).map((value) => ({ label: value, value })),

  spiritType: Object.values(SpiritType).map((spiritType) => ({
    value: spiritType,
    label: SpiritTypeLabels[spiritType],
  })),

  weaponSkill: Object.entries(skillList)
    .filter(([_, skill]) => skill.isWeaponSkill)
    .map(([key]) => ({ label: key, value: key })),

  weaponSkillAttribute: [
    { label: "None", value: "" },
    ...Object.values(AttributeKey).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    })),
  ],

  weaponType: [
    { label: "Melee", value: WeaponType.melee },
    { label: "Firearm", value: WeaponType.firearm },
    { label: "Thrown", value: WeaponType.thrown },
    { label: "Projectile", value: WeaponType.projectile },
    { label: "Exotic", value: WeaponType.exotic },
    { label: "Other", value: WeaponType.other },
  ],
} satisfies Record<string, SelectOption[]>
