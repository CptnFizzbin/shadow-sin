import { Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useActiveSkill, useCharacterData } from '../../Character/CharacterProvider'
import { ActiveSkillName } from '../../Skills'
import { SpellBlock } from '../../Spells/SpellBlock'
import {
  ConjuringSpellcastingPool,
  EnchantingSpellcastingPool,
  ResistDrain,
  SorcerySpellcastingPool,
} from '../../Spells/SpellDicePools'
import { DicePools } from '../../UI/DicePool'

export const SpellsPage: FC = () => {
  const character = useCharacterData()

  const sorcery = useActiveSkill(ActiveSkillName.sorcery)
  const conjuring = useActiveSkill(ActiveSkillName.conjuring)
  const enchanting = useActiveSkill(ActiveSkillName.enchanting)

  if (!character) return null
  const spells = character.spells || []

  return (
    <Stack gap={1}>
      <Typography variant={'h4'}>Spells</Typography>

      <DicePools>
        {sorcery && <SorcerySpellcastingPool />}
        {conjuring && <ConjuringSpellcastingPool />}
        {enchanting && <EnchantingSpellcastingPool />}
        <ResistDrain />
      </DicePools>

      {spells.map(spell => (
        <SpellBlock key={spell.id} spell={spell} />
      ))}
    </Stack>
  )
}
