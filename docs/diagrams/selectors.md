# Selector graph

Every selector in `src/` — 210 across 36 files. An arrow `A --> B` means **A reads B**
(B is one of A's reselect inputs, or A calls it). A dotted arrow is the Wound Modifier Dice Group that
`createDicePoolSelector` appends to every dice pool not built with `excludeWoundMod: true`.

Generated from the TypeScript sources by symbol resolution; regenerate it rather than hand-editing when selectors change.

## File overview

One node per selector file; an arrow means some selector in the first file reads one in the second.

```mermaid
flowchart LR
  f_services_improvements_improvementSelectors["ImprovementsSelectors<br/><small>services/improvements/improvementSelectors.ts · 4</small>"]
  f_services_dice_state_diceRoller_selector["(module-scope selectors)<br/><small>services/dice/state/diceRoller.selector.ts · 9</small>"]
  f_services_initiativeTracker_initiativeTrackerSlice_selectors["(module-scope selectors)<br/><small>services/initiativeTracker/initiativeTrackerSlice.selectors.ts · 4</small>"]
  f_state_runner_skills_skills_selector["SkillsSelectors<br/><small>state/runner/skills/skills.selector.ts · 18</small>"]
  f_state_runner_dicePool_contactPools_selector["ContactPoolSelectors<br/><small>state/runner/dicePool/contactPools.selector.ts · 4</small>"]
  f_state_runner_dicePool_magicPools_selector["MagicPoolSelectors<br/><small>state/runner/dicePool/magicPools.selector.ts · 10</small>"]
  f_state_runner_dicePool_combatPools_selector["CombatPoolSelectors<br/><small>state/runner/dicePool/combatPools.selector.ts · 26</small>"]
  f_state_runner_dicePool_skillPools_selector["SkillPoolSelectors<br/><small>state/runner/dicePool/skillPools.selector.ts · 6</small>"]
  f_state_runner_gameState_matrix_matrix_selector["MatrixSelectors<br/><small>state/runner/gameState/matrix/matrix.selector.ts · 4</small>"]
  f_state_runner_complexForms_complexForms_selector["ComplexFormsSelectors<br/><small>state/runner/complexForms/complexForms.selector.ts · 3</small>"]
  f_state_runner_edge_edge_selector["EdgeSelectors<br/><small>state/runner/edge/edge.selector.ts · 2</small>"]
  f_state_runner_extendedTests_extendedTests_selector["ExtendedTestsSelectors<br/><small>state/runner/extendedTests/extendedTests.selector.ts · 1</small>"]
  f_state_runner_viewerSelector["ViewerStateSelectors<br/><small>state/runner/viewerSelector.ts · 4</small>"]
  f_state_runner_profile_profile_selector["ProfileSelectors<br/><small>state/runner/profile/profile.selector.ts · 4</small>"]
  f_state_runner_karma_karma_selector["KarmaSelectors<br/><small>state/runner/karma/karma.selector.ts · 4</small>"]
  f_state_runner_notes_notes_selector["NotesSelectors<br/><small>state/runner/notes/notes.selector.ts · 1</small>"]
  f_state_runner_biology_biology_selector["BiologySelectors<br/><small>state/runner/biology/biology.selector.ts · 6</small>"]
  f_state_runner_reputation_reputation_selector["ReputationSelectors<br/><small>state/runner/reputation/reputation.selector.ts · 7</small>"]
  f_state_runner_houseRules_houseRules_selector["HouseRulesSelectors<br/><small>state/runner/houseRules/houseRules.selector.ts · 1</small>"]
  f_state_runner_qualities_qualities_selector["QualitiesSelectors<br/><small>state/runner/qualities/qualities.selector.ts · 1</small>"]
  f_state_runner_tradition_tradition_selector["TraditionSelectors<br/><small>state/runner/tradition/tradition.selector.ts · 1</small>"]
  f_state_runner_items_items_selector["ItemSelectors<br/><small>state/runner/items/items.selector.ts · 33</small>"]
  f_state_runner_contacts_contacts_selector["ContactsSelectors<br/><small>state/runner/contacts/contacts.selector.ts · 1</small>"]
  f_state_runner_spirits_spirits_selector["SpiritsSelectors<br/><small>state/runner/spirits/spirits.selector.ts · 1</small>"]
  f_state_runner_initiative_initiative_selector["InitiativeSelectors<br/><small>state/runner/initiative/initiative.selector.ts · 4</small>"]
  f_state_runner_meta_meta_selector["MetaSelectors<br/><small>state/runner/meta/meta.selector.ts · 1</small>"]
  f_state_runner_damage_damage_selector["DamageSelectors<br/><small>state/runner/damage/damage.selector.ts · 9</small>"]
  f_state_runner_nuyen_nuyen_selector["NuyenSelectors<br/><small>state/runner/nuyen/nuyen.selector.ts · 3</small>"]
  f_state_runner_powers_powers_selector["PowersSelectors<br/><small>state/runner/powers/powers.selector.ts · 2</small>"]
  f_state_runner_attributes_attributes_selector["AttrSelectors<br/><small>state/runner/attributes/attributes.selector.ts · 18</small>"]
  f_state_runner_spells_spells_selector["SpellsSelectors<br/><small>state/runner/spells/spells.selector.ts · 1</small>"]
  f_state_runner_lifestyle_lifestyle_selector["LifestyleSelectors<br/><small>state/runner/lifestyle/lifestyle.selector.ts · 8</small>"]
  f_state_runner_gameEffects_gameEffects_selector["SourcedGameEffectSelectors<br/><small>state/runner/gameEffects/gameEffects.selector.ts · 2</small>"]
  f_state_runner_gameEffects_dicePoolMods_selector["DicePoolModSelectors<br/><small>state/runner/gameEffects/dicePoolMods.selector.ts · 2</small>"]
  f_state_runner_sprites_sprites_selector["SpriteSelectors<br/><small>state/runner/sprites/sprites.selector.ts · 4</small>"]
  f_state_builder_builderStore_selectors["BuilderStateSelectors<br/><small>state/builder/builderStore.selectors.ts · 1</small>"]
  f_services_improvements_improvementSelectors --> f_state_runner_attributes_attributes_selector
  f_state_runner_skills_skills_selector --> f_state_runner_viewerSelector
  f_state_runner_skills_skills_selector --> f_state_runner_biology_biology_selector
  f_state_runner_skills_skills_selector --> f_state_runner_gameEffects_gameEffects_selector
  f_state_runner_dicePool_contactPools_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_dicePool_contactPools_selector --> f_state_runner_skills_skills_selector
  f_state_runner_dicePool_contactPools_selector --> f_state_runner_damage_damage_selector
  f_state_runner_dicePool_magicPools_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_dicePool_magicPools_selector --> f_state_runner_gameEffects_dicePoolMods_selector
  f_state_runner_dicePool_magicPools_selector --> f_state_runner_skills_skills_selector
  f_state_runner_dicePool_magicPools_selector --> f_state_runner_damage_damage_selector
  f_state_runner_dicePool_combatPools_selector --> f_state_runner_skills_skills_selector
  f_state_runner_dicePool_combatPools_selector --> f_state_runner_gameEffects_dicePoolMods_selector
  f_state_runner_dicePool_combatPools_selector --> f_state_runner_items_items_selector
  f_state_runner_dicePool_combatPools_selector --> f_state_runner_damage_damage_selector
  f_state_runner_dicePool_combatPools_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_dicePool_skillPools_selector --> f_state_runner_gameEffects_dicePoolMods_selector
  f_state_runner_dicePool_skillPools_selector --> f_state_runner_skills_skills_selector
  f_state_runner_dicePool_skillPools_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_dicePool_skillPools_selector --> f_state_runner_damage_damage_selector
  f_state_runner_gameState_matrix_matrix_selector --> f_state_runner_viewerSelector
  f_state_runner_complexForms_complexForms_selector --> f_state_runner_viewerSelector
  f_state_runner_complexForms_complexForms_selector --> f_state_runner_biology_biology_selector
  f_state_runner_complexForms_complexForms_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_edge_edge_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_edge_edge_selector --> f_state_runner_viewerSelector
  f_state_runner_extendedTests_extendedTests_selector --> f_state_runner_viewerSelector
  f_state_runner_profile_profile_selector --> f_state_runner_viewerSelector
  f_state_runner_karma_karma_selector --> f_state_runner_viewerSelector
  f_state_runner_notes_notes_selector --> f_state_runner_viewerSelector
  f_state_runner_biology_biology_selector --> f_state_runner_viewerSelector
  f_state_runner_reputation_reputation_selector --> f_state_runner_viewerSelector
  f_state_runner_reputation_reputation_selector --> f_state_runner_karma_karma_selector
  f_state_runner_qualities_qualities_selector --> f_state_runner_viewerSelector
  f_state_runner_tradition_tradition_selector --> f_state_runner_viewerSelector
  f_state_runner_items_items_selector --> f_state_runner_viewerSelector
  f_state_runner_contacts_contacts_selector --> f_state_runner_viewerSelector
  f_state_runner_spirits_spirits_selector --> f_state_runner_viewerSelector
  f_state_runner_initiative_initiative_selector --> f_state_runner_viewerSelector
  f_state_runner_meta_meta_selector --> f_state_runner_viewerSelector
  f_state_runner_damage_damage_selector --> f_state_runner_viewerSelector
  f_state_runner_damage_damage_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_nuyen_nuyen_selector --> f_state_runner_viewerSelector
  f_state_runner_powers_powers_selector --> f_state_runner_viewerSelector
  f_state_runner_attributes_attributes_selector --> f_state_runner_viewerSelector
  f_state_runner_attributes_attributes_selector --> f_state_runner_items_items_selector
  f_state_runner_attributes_attributes_selector --> f_state_runner_gameState_matrix_matrix_selector
  f_state_runner_attributes_attributes_selector --> f_state_runner_gameEffects_gameEffects_selector
  f_state_runner_attributes_attributes_selector --> f_state_runner_biology_biology_selector
  f_state_runner_spells_spells_selector --> f_state_runner_viewerSelector
  f_state_runner_lifestyle_lifestyle_selector --> f_state_runner_viewerSelector
  f_state_runner_gameEffects_gameEffects_selector --> f_state_runner_viewerSelector
  f_state_runner_gameEffects_gameEffects_selector --> f_state_runner_qualities_qualities_selector
  f_state_runner_gameEffects_gameEffects_selector --> f_state_runner_items_items_selector
  f_state_runner_gameEffects_gameEffects_selector --> f_state_runner_spells_spells_selector
  f_state_runner_gameEffects_gameEffects_selector --> f_state_runner_powers_powers_selector
  f_state_runner_gameEffects_dicePoolMods_selector --> f_state_runner_viewerSelector
  f_state_runner_gameEffects_dicePoolMods_selector --> f_state_runner_gameEffects_gameEffects_selector
  f_state_runner_sprites_sprites_selector --> f_state_runner_viewerSelector
  f_state_runner_sprites_sprites_selector --> f_state_runner_biology_biology_selector
  f_state_runner_sprites_sprites_selector --> f_state_runner_attributes_attributes_selector
  f_state_runner_sprites_sprites_selector --> f_state_runner_skills_skills_selector
```

## Selectors by file

Rounded grey nodes are selectors from other files that this file reads.

### services/dice/state/diceRoller.selector

`src/services/dice/state/diceRoller.selector.ts`

```mermaid
flowchart LR
  subgraph s_diceRoller_selector["module scope (not exported from a namespace)"]
    n4["selectWasRolled"]
    n5["selectIsRolling"]
    n6["selectAllDice"]
    n7["selectAllSettled"]
    n8["selectSettledDice"]
    n9["selectHits"]
    n10["selectIsGlitch"]
    n11["selectIsCriticalGlitch"]
    n12["selectRollState"]
  end
  n7 --> n6
  n8 --> n6
  n9 --> n8
  n11 --> n10
  n12 --> n4
  n12 --> n5
  n12 --> n11
  n12 --> n10
  n12 --> n9
```

### ImprovementsSelectors

`src/services/improvements/improvementSelectors.ts`

```mermaid
flowchart LR
  subgraph s_improvementSelectors["module scope (not exported from a namespace)"]
    n0["selectAllImprovements"]
    n1["selectHasImprovements"]
    n2["selectImprovementsTotalCost"]
  end
  subgraph s_ImprovementsSelectors["ImprovementsSelectors"]
    n3["selectImprovableAttrs"]
  end
  n187(["AttrSelectors.selectAllInfo"]):::external
  n1 --> n0
  n2 --> n0
  n3 --> n187
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### services/initiativeTracker/initiativeTrackerSlice.selectors

`src/services/initiativeTracker/initiativeTrackerSlice.selectors.ts`

```mermaid
flowchart LR
  subgraph s_initiativeTrackerSlice_selectors["module scope (not exported from a namespace)"]
    n13["selectCombatants"]
    n14["selectSortedCombatants"]
    n15["selectRound"]
    n16["selectCurrentTurnId"]
  end
  n14 --> n13
```

### BuilderStateSelectors

`src/state/builder/builderStore.selectors.ts`

```mermaid
flowchart LR
  subgraph s_BuilderStateSelectors_nuyen["BuilderStateSelectors.nuyen"]
    n209["selectStartingNuyen"]
  end
```

### AttrSelectors

`src/state/runner/attributes/attributes.selector.ts`

```mermaid
flowchart LR
  subgraph s_AttrSelectors["AttrSelectors"]
    n174["selectAllRaw"]
    n175["selectBase"]
    n176["selectEssenceSpent"]
    n177["selectRawValue"]
    n178["selectValue"]
    n179["selectModifiers"]
    n180["selectAugmentedMax"]
    n181["selectPenalties"]
    n182["selectRatingBreakdown"]
    n183["selectRating"]
    n184["selectAllRatings"]
    n185["forAttr"]
    n186["selectBounds"]
    n187["selectAllInfo"]
    n188["selectAll"]
    n189["selectInfo"]
    n190["selectHasMaxxed"]
  end
  subgraph s_AttrSelectors_DiceGroups["AttrSelectors.DiceGroups"]
    n191["selectAttr"]
  end
  n93(["ViewerStateSelectors.selectEntity"]):::external
  n139(["ItemSelectors.Implants.selectImplanted"]):::external
  n83(["MatrixSelectors.selectActiveNode"]):::external
  n202(["SourcedGameEffectSelectors.selectAll"]):::external
  n135(["ItemSelectors.Armor.selectBulk"]):::external
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n94(["ViewerStateSelectors.selectItems"]):::external
  n107(["BiologySelectors.selectMetatypeInfo"]):::external
  n108(["BiologySelectors.selectAwakeningInfo"]):::external
  n105(["BiologySelectors.selectMetatype"]):::external
  n174 --> n93
  n175 --> n174
  n176 --> n139
  n177 --> n93
  n177 --> n174
  n177 --> n176
  n177 --> n83
  n178 --> n177
  n179 --> n93
  n179 --> n202
  n180 --> n186
  n181 --> n93
  n181 --> n135
  n181 --> n177
  n182 --> n177
  n182 --> n179
  n182 --> n180
  n182 --> n181
  n183 --> n182
  n184 --> n92
  n184 --> n93
  n184 --> n94
  n184 --> n183
  n185 --> n175
  n185 --> n178
  n185 --> n177
  n185 --> n183
  n186 --> n107
  n186 --> n108
  n187 --> n186
  n187 --> n93
  n187 --> n94
  n187 --> n105
  n187 --> n175
  n187 --> n178
  n188 --> n187
  n189 --> n187
  n190 --> n187
  n191 --> n182
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### BiologySelectors

`src/state/runner/biology/biology.selector.ts`

```mermaid
flowchart LR
  subgraph s_BiologySelectors["BiologySelectors"]
    n104["select"]
    n105["selectMetatype"]
    n106["selectAwakening"]
    n107["selectMetatypeInfo"]
    n108["selectAwakeningInfo"]
    n109["selectIsAiMetaType"]
  end
  n93(["ViewerStateSelectors.selectEntity"]):::external
  n104 --> n93
  n105 --> n104
  n106 --> n104
  n107 --> n105
  n108 --> n106
  n109 --> n107
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ComplexFormsSelectors

`src/state/runner/complexForms/complexForms.selector.ts`

```mermaid
flowchart LR
  subgraph s_ComplexFormsSelectors["ComplexFormsSelectors"]
    n85["selectAll"]
    n86["selectVisible"]
    n87["selectMax"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n106(["BiologySelectors.selectAwakening"]):::external
  n185(["AttrSelectors.forAttr"]):::external
  n85 --> n92
  n86 --> n106
  n86 --> n85
  n87 --> n185
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ContactsSelectors

`src/state/runner/contacts/contacts.selector.ts`

```mermaid
flowchart LR
  subgraph s_ContactsSelectors["ContactsSelectors"]
    n153["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n153 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### DamageSelectors

`src/state/runner/damage/damage.selector.ts`

```mermaid
flowchart LR
  subgraph s_DamageSelectors["DamageSelectors"]
    n160["selectWoundIntervalModifier"]
    n161["selectWoundInterval"]
    n162["selectWoundIntervalOffset"]
    n163["selectWoundModForTrack"]
    n164["selectWoundMod"]
    n165["selectDamage"]
    n166["selectMatrixMax"]
    n167["selectWoundModValue"]
  end
  subgraph s_DamageSelectors_DiceGroups["DamageSelectors.DiceGroups"]
    n168["selectWoundMod"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n93(["ViewerStateSelectors.selectEntity"]):::external
  n185(["AttrSelectors.forAttr"]):::external
  n160 --> n92
  n160 --> n93
  n161 --> n160
  n162 --> n92
  n162 --> n93
  n163 --> n161
  n163 --> n162
  n163 --> n93
  n164 --> n163
  n165 --> n93
  n166 --> n185
  n167 --> n164
  n168 --> n167
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### CombatPoolSelectors

`src/state/runner/dicePool/combatPools.selector.ts`

```mermaid
flowchart LR
  subgraph s_combatPools_selector["module scope (not exported from a namespace)"]
    n49["selectReactionGroups"]
    n50["selectBodyGroups"]
    n51["selectWillpowerGroups"]
    n52["selectDodgeGroups"]
    n53["selectUnarmedCombatGroups"]
    n54["selectCounterspellingGroups"]
    n55["selectWeaponAttackModGroups"]
    n56["selectDamageResistanceAttrGroups"]
    n57["selectDefenseSkillGroups"]
    n58["selectTotalArmorGroups"]
  end
  subgraph s_CombatPoolSelectors["CombatPoolSelectors"]
    n59["selectResistDamageTest"]
    n60["selectResistManaSpellTest"]
    n61["selectResistPhysicalSpellTest"]
    n62["selectRangedDefenseTest"]
    n63["selectRangedFullDefenseTest"]
    n64["selectMeleeBlockTest"]
    n65["selectMeleeDodgeTest"]
    n66["selectMeleeFullBlockTest"]
    n67["selectMeleeFullDodgeTest"]
    n68["selectMeleeParryTest"]
    n69["selectMeleeFullParryTest"]
    n70["selectPhysicalSpellDefenseTest"]
    n71["selectManaSpellDefenseTest"]
    n72["selectAttackTest"]
    n73["selectDefenseCalculatorTest"]
    n74["selectDefenseCalculatorResistTest"]
  end
  n32(["SkillsSelectors.DiceGroups.selectSpecializationCovering"]):::external
  n203(["DicePoolModSelectors.selectGroups"]):::external
  n30(["SkillsSelectors.DiceGroups.selectSkill"]):::external
  n133(["ItemSelectors.Armor.selectEquipped"]):::external
  n137(["ItemSelectors.Armor.DiceGroups.selectArmor"]):::external
  n168(["DamageSelectors.DiceGroups.selectWoundMod"]):::external
  n191(["AttrSelectors.DiceGroups.selectAttr"]):::external
  n54 --> n32
  n54 --> n203
  n55 --> n203
  n56 --> n50
  n56 --> n51
  n57 --> n30
  n58 --> n133
  n59 --> n56
  n59 --> n137
  n60 --> n51
  n61 --> n50
  n62 --> n49
  n62 -.-> n168
  n63 --> n49
  n63 --> n52
  n63 -.-> n168
  n64 --> n49
  n64 --> n53
  n64 -.-> n168
  n65 --> n49
  n65 --> n52
  n65 -.-> n168
  n66 --> n49
  n66 --> n53
  n66 --> n52
  n66 -.-> n168
  n67 --> n49
  n67 --> n52
  n67 -.-> n168
  n68 --> n49
  n68 --> n30
  n68 -.-> n168
  n69 --> n49
  n69 --> n30
  n69 --> n52
  n69 -.-> n168
  n70 --> n50
  n70 --> n54
  n70 -.-> n168
  n71 --> n51
  n71 --> n54
  n71 -.-> n168
  n72 --> n191
  n72 --> n30
  n72 --> n55
  n72 -.-> n168
  n73 --> n191
  n73 --> n57
  n73 -.-> n168
  n74 --> n191
  n74 --> n58
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ContactPoolSelectors

`src/state/runner/dicePool/contactPools.selector.ts`

```mermaid
flowchart LR
  subgraph s_contactPools_selector["module scope (not exported from a namespace)"]
    n35["selectConnectionGroups"]
    n36["selectLoyaltyGroups"]
  end
  subgraph s_ContactPoolSelectors["ContactPoolSelectors"]
    n37["selectLegworkGmTest"]
    n38["selectLegworkPlayerTest"]
  end
  n191(["AttrSelectors.DiceGroups.selectAttr"]):::external
  n30(["SkillsSelectors.DiceGroups.selectSkill"]):::external
  n168(["DamageSelectors.DiceGroups.selectWoundMod"]):::external
  n37 --> n35
  n38 --> n191
  n38 --> n30
  n38 --> n36
  n38 -.-> n168
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### MagicPoolSelectors

`src/state/runner/dicePool/magicPools.selector.ts`

```mermaid
flowchart LR
  subgraph s_magicPools_selector["module scope (not exported from a namespace)"]
    n39["selectMagicGroups"]
    n40["selectWillpowerGroups"]
    n41["selectSpiritSpecializationGroups"]
    n42["selectSpellcastingSpecializationGroups"]
    n43["selectSpellcastingModGroups"]
    n44["selectSpiritModGroups"]
    n45["selectDrainAttrGroups"]
  end
  subgraph s_MagicPoolSelectors["MagicPoolSelectors"]
    n46["selectSpellcastingTest"]
    n47["selectDrainResistanceTest"]
    n48["selectSummoningTest"]
  end
  n191(["AttrSelectors.DiceGroups.selectAttr"]):::external
  n203(["DicePoolModSelectors.selectGroups"]):::external
  n28(["SkillsSelectors.selectSpecialization"]):::external
  n31(["SkillsSelectors.DiceGroups.selectSpecialization"]):::external
  n32(["SkillsSelectors.DiceGroups.selectSpecializationCovering"]):::external
  n30(["SkillsSelectors.DiceGroups.selectSkill"]):::external
  n168(["DamageSelectors.DiceGroups.selectWoundMod"]):::external
  n39 --> n191
  n39 --> n203
  n40 --> n191
  n41 --> n28
  n41 --> n31
  n42 --> n32
  n43 --> n203
  n44 --> n203
  n45 --> n191
  n46 --> n39
  n46 --> n30
  n46 --> n42
  n46 --> n43
  n46 -.-> n168
  n47 --> n40
  n47 --> n45
  n48 --> n39
  n48 --> n30
  n48 --> n41
  n48 --> n44
  n48 -.-> n168
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SkillPoolSelectors

`src/state/runner/dicePool/skillPools.selector.ts`

```mermaid
flowchart LR
  subgraph s_skillPools_selector["module scope (not exported from a namespace)"]
    n75["selectMagicTestModGroups"]
    n76["selectSkillPoolModGroups"]
  end
  subgraph s_SkillPoolSelectors["SkillPoolSelectors"]
    n77["selectActiveSkillTest"]
    n78["selectKnowledgeSkillTest"]
    n79["selectLanguageSkillTest"]
    n80["selectAvailabilityTest"]
  end
  n203(["DicePoolModSelectors.selectGroups"]):::external
  n30(["SkillsSelectors.DiceGroups.selectSkill"]):::external
  n191(["AttrSelectors.DiceGroups.selectAttr"]):::external
  n31(["SkillsSelectors.DiceGroups.selectSpecialization"]):::external
  n168(["DamageSelectors.DiceGroups.selectWoundMod"]):::external
  n33(["SkillsSelectors.DiceGroups.selectKnowledgeSkill"]):::external
  n34(["SkillsSelectors.DiceGroups.selectLanguageSkill"]):::external
  n75 --> n203
  n76 --> n203
  n77 --> n30
  n77 --> n191
  n77 --> n75
  n77 --> n31
  n77 --> n76
  n77 -.-> n168
  n78 --> n33
  n78 --> n191
  n78 -.-> n168
  n79 --> n34
  n79 --> n191
  n79 -.-> n168
  n80 --> n30
  n80 --> n191
  n80 -.-> n168
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### EdgeSelectors

`src/state/runner/edge/edge.selector.ts`

```mermaid
flowchart LR
  subgraph s_EdgeSelectors["EdgeSelectors"]
    n88["selectMax"]
    n89["selectCurrent"]
  end
  n185(["AttrSelectors.forAttr"]):::external
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n88 --> n185
  n89 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ExtendedTestsSelectors

`src/state/runner/extendedTests/extendedTests.selector.ts`

```mermaid
flowchart LR
  subgraph s_ExtendedTestsSelectors["ExtendedTestsSelectors"]
    n90["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n90 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### DicePoolModSelectors

`src/state/runner/gameEffects/dicePoolMods.selector.ts`

```mermaid
flowchart LR
  subgraph s_DicePoolModSelectors["DicePoolModSelectors"]
    n203["selectGroups"]
    n204["selectSubTargets"]
  end
  n93(["ViewerStateSelectors.selectEntity"]):::external
  n202(["SourcedGameEffectSelectors.selectAll"]):::external
  n203 --> n93
  n203 --> n202
  n204 --> n93
  n204 --> n202
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SourcedGameEffectSelectors

`src/state/runner/gameEffects/gameEffects.selector.ts`

```mermaid
flowchart LR
  subgraph s_gameEffects_selector["module scope (not exported from a namespace)"]
    n201["selectComplexForms"]
  end
  subgraph s_SourcedGameEffectSelectors["SourcedGameEffectSelectors"]
    n202["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n118(["QualitiesSelectors.selectAll"]):::external
  n120(["ItemSelectors.selectAll"]):::external
  n192(["SpellsSelectors.selectAll"]):::external
  n172(["PowersSelectors.selectAll"]):::external
  n201 --> n92
  n202 --> n118
  n202 --> n120
  n202 --> n192
  n202 --> n201
  n202 --> n172
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### MatrixSelectors

`src/state/runner/gameState/matrix/matrix.selector.ts`

```mermaid
flowchart LR
  subgraph s_MatrixSelectors["MatrixSelectors"]
    n81["selectKnownNodes"]
    n82["selectActiveNodeId"]
    n83["selectActiveNode"]
    n84["selectActivePrograms"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n81 --> n92
  n82 --> n92
  n83 --> n81
  n83 --> n82
  n84 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### HouseRulesSelectors

`src/state/runner/houseRules/houseRules.selector.ts`

```mermaid
flowchart LR
  subgraph s_HouseRulesSelectors["HouseRulesSelectors"]
    n117["select"]
  end
```

### InitiativeSelectors

`src/state/runner/initiative/initiative.selector.ts`

```mermaid
flowchart LR
  subgraph s_InitiativeSelectors["InitiativeSelectors"]
    n155["selectPassesCompleted"]
    n156["selectRolledResults"]
    n157["selectGoingFirst"]
    n158["selectExtraPasses"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n155 --> n92
  n156 --> n92
  n157 --> n92
  n158 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ItemSelectors

`src/state/runner/items/items.selector.ts`

```mermaid
flowchart LR
  subgraph s_ItemSelectors["ItemSelectors"]
    n120["selectAll"]
    n121["selectCatalog"]
    n122["selectCatalogTree"]
    n123["selectByFilter"]
    n124["selectOnHand"]
    n125["selectActive"]
    n126["selectStashed"]
    n127["selectById"]
    n128["selectByType"]
    n129["selectChildrenOf"]
    n130["selectChildListOf"]
  end
  subgraph s_ItemSelectors_Armor["ItemSelectors.Armor"]
    n131["selectById"]
    n132["selectAll"]
    n133["selectEquipped"]
    n134["selectTotal"]
    n135["selectBulk"]
    n136["selectEffective"]
  end
  subgraph s_ItemSelectors_Armor_DiceGroups["ItemSelectors.Armor.DiceGroups"]
    n137["selectArmor"]
  end
  subgraph s_ItemSelectors_Implants["ItemSelectors.Implants"]
    n138["selectById"]
    n139["selectImplanted"]
  end
  subgraph s_ItemSelectors_Software["ItemSelectors.Software"]
    n140["selectById"]
  end
  subgraph s_ItemSelectors_Vehicles["ItemSelectors.Vehicles"]
    n141["selectById"]
  end
  subgraph s_ItemSelectors_Weapons["ItemSelectors.Weapons"]
    n142["selectById"]
  end
  subgraph s_ItemSelectors_Devices["ItemSelectors.Devices"]
    n143["selectById"]
  end
  subgraph s_ItemSelectors_Matrix["ItemSelectors.Matrix"]
    n144["selectStats"]
  end
  subgraph s_ItemSelectors_FirearmAccessories["ItemSelectors.FirearmAccessories"]
    n145["selectById"]
  end
  subgraph s_ItemSelectors_Sins["ItemSelectors.Sins"]
    n146["selectById"]
  end
  subgraph s_ItemSelectors_Credsticks["ItemSelectors.Credsticks"]
    n147["selectById"]
  end
  subgraph s_ItemSelectors_Programs["ItemSelectors.Programs"]
    n148["selectById"]
  end
  subgraph s_ItemSelectors_Other["ItemSelectors.Other"]
    n149["selectById"]
  end
  subgraph s_ItemSelectors_Licenses["ItemSelectors.Licenses"]
    n150["selectById"]
    n151["selectForItem"]
    n152["selectItemsForId"]
  end
  n94(["ViewerStateSelectors.selectItems"]):::external
  n120 --> n94
  n121 --> n94
  n122 --> n94
  n123 --> n94
  n124 --> n94
  n125 --> n94
  n126 --> n94
  n127 --> n94
  n128 --> n94
  n129 --> n94
  n130 --> n129
  n131 --> n94
  n132 --> n94
  n133 --> n132
  n134 --> n133
  n135 --> n133
  n136 --> n133
  n137 --> n136
  n138 --> n94
  n139 --> n94
  n140 --> n94
  n141 --> n94
  n142 --> n94
  n143 --> n94
  n144 --> n127
  n145 --> n94
  n146 --> n94
  n147 --> n94
  n148 --> n94
  n149 --> n94
  n150 --> n94
  n151 --> n94
  n152 --> n94
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### KarmaSelectors

`src/state/runner/karma/karma.selector.ts`

```mermaid
flowchart LR
  subgraph s_KarmaSelectors["KarmaSelectors"]
    n99["select"]
    n100["selectCurrent"]
    n101["selectLog"]
    n102["selectTotal"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n99 --> n92
  n100 --> n99
  n101 --> n99
  n102 --> n99
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### LifestyleSelectors

`src/state/runner/lifestyle/lifestyle.selector.ts`

```mermaid
flowchart LR
  subgraph s_LifestyleSelectors["LifestyleSelectors"]
    n193["select"]
    n194["selectName"]
    n195["selectUpkeep"]
    n196["selectMonthsPaid"]
    n197["selectNotes"]
    n198["selectStandardType"]
    n199["selectStartingNuyenType"]
    n200["selectPrepaidCost"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n193 --> n92
  n194 --> n193
  n195 --> n193
  n196 --> n193
  n197 --> n193
  n198 --> n193
  n199 --> n193
  n200 --> n193
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### MetaSelectors

`src/state/runner/meta/meta.selector.ts`

```mermaid
flowchart LR
  subgraph s_MetaSelectors["MetaSelectors"]
    n159["selectLastExportDate"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n159 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### NotesSelectors

`src/state/runner/notes/notes.selector.ts`

```mermaid
flowchart LR
  subgraph s_NotesSelectors["NotesSelectors"]
    n103["select"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n103 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### NuyenSelectors

`src/state/runner/nuyen/nuyen.selector.ts`

```mermaid
flowchart LR
  subgraph s_NuyenSelectors["NuyenSelectors"]
    n169["select"]
    n170["selectAmount"]
    n171["selectLoans"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n169 --> n92
  n170 --> n169
  n171 --> n169
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### PowersSelectors

`src/state/runner/powers/powers.selector.ts`

```mermaid
flowchart LR
  subgraph s_PowersSelectors["PowersSelectors"]
    n172["selectAll"]
    n173["selectUsed"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n172 --> n92
  n173 --> n172
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ProfileSelectors

`src/state/runner/profile/profile.selector.ts`

```mermaid
flowchart LR
  subgraph s_ProfileSelectors["ProfileSelectors"]
    n95["select"]
    n96["selectName"]
    n97["selectAlias"]
    n98["selectDisplayName"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n95 --> n92
  n96 --> n95
  n97 --> n95
  n98 --> n97
  n98 --> n96
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### QualitiesSelectors

`src/state/runner/qualities/qualities.selector.ts`

```mermaid
flowchart LR
  subgraph s_QualitiesSelectors["QualitiesSelectors"]
    n118["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n118 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ReputationSelectors

`src/state/runner/reputation/reputation.selector.ts`

```mermaid
flowchart LR
  subgraph s_ReputationSelectors["ReputationSelectors"]
    n110["selectLedger"]
    n111["selectLedgerForType"]
    n112["selectStreetCred"]
    n113["selectNotoriety"]
    n114["selectPublicAwareness"]
    n115["selectPublicAwarenessInfo"]
    n116["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n102(["KarmaSelectors.selectTotal"]):::external
  n110 --> n92
  n111 --> n92
  n112 --> n102
  n112 --> n111
  n113 --> n111
  n114 --> n112
  n114 --> n113
  n114 --> n110
  n115 --> n114
  n116 --> n112
  n116 --> n113
  n116 --> n114
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SkillsSelectors

`src/state/runner/skills/skills.selector.ts`

```mermaid
flowchart LR
  subgraph s_SkillsSelectors["SkillsSelectors"]
    n17["selectActiveSkills"]
    n18["selectSkillGroups"]
    n19["selectKnowledgeSkills"]
    n20["selectLanguageSkills"]
    n21["selectAllowedActive"]
    n22["selectRawValue"]
    n23["selectValue"]
    n24["selectModifiers"]
    n25["selectRatingBreakdown"]
    n26["selectRating"]
    n27["selectSpecializationBreakdown"]
    n28["selectSpecialization"]
    n29["selectActiveSkill"]
  end
  subgraph s_SkillsSelectors_DiceGroups["SkillsSelectors.DiceGroups"]
    n30["selectSkill"]
    n31["selectSpecialization"]
    n32["selectSpecializationCovering"]
    n33["selectKnowledgeSkill"]
    n34["selectLanguageSkill"]
  end
  n93(["ViewerStateSelectors.selectEntity"]):::external
  n106(["BiologySelectors.selectAwakening"]):::external
  n202(["SourcedGameEffectSelectors.selectAll"]):::external
  n17 --> n93
  n18 --> n93
  n19 --> n93
  n20 --> n93
  n21 --> n106
  n22 --> n17
  n22 --> n18
  n23 --> n22
  n24 --> n93
  n24 --> n202
  n25 --> n22
  n25 --> n24
  n26 --> n25
  n27 --> n93
  n27 --> n202
  n28 --> n17
  n29 --> n17
  n29 --> n23
  n30 --> n25
  n31 --> n27
  n32 --> n31
  n32 --> n28
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SpellsSelectors

`src/state/runner/spells/spells.selector.ts`

```mermaid
flowchart LR
  subgraph s_SpellsSelectors["SpellsSelectors"]
    n192["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n192 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SpiritsSelectors

`src/state/runner/spirits/spirits.selector.ts`

```mermaid
flowchart LR
  subgraph s_SpiritsSelectors["SpiritsSelectors"]
    n154["selectAll"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n154 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### SpriteSelectors

`src/state/runner/sprites/sprites.selector.ts`

```mermaid
flowchart LR
  subgraph s_SpriteSelectors["SpriteSelectors"]
    n205["selectAll"]
    n206["selectVisible"]
    n207["selectMaxRegistered"]
    n208["selectMaxTasks"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n106(["BiologySelectors.selectAwakening"]):::external
  n185(["AttrSelectors.forAttr"]):::external
  n23(["SkillsSelectors.selectValue"]):::external
  n205 --> n92
  n206 --> n106
  n206 --> n205
  n207 --> n185
  n208 --> n23
  n208 --> n185
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### TraditionSelectors

`src/state/runner/tradition/tradition.selector.ts`

```mermaid
flowchart LR
  subgraph s_TraditionSelectors["TraditionSelectors"]
    n119["select"]
  end
  n92(["ViewerStateSelectors.selectRunner"]):::external
  n119 --> n92
  classDef external fill:#f4f4f4,stroke:#999,stroke-dasharray:3 3,color:#555
```

### ViewerStateSelectors

`src/state/runner/viewerSelector.ts`

```mermaid
flowchart LR
  subgraph s_viewerSelector["module scope (not exported from a namespace)"]
    n91["selectEntity"]
  end
  subgraph s_ViewerStateSelectors["ViewerStateSelectors"]
    n92["selectRunner"]
    n93["selectEntity"]
    n94["selectItems"]
  end
  n93 --> n91
```
