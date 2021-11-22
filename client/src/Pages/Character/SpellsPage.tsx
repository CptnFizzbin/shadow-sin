import { Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useActiveSkill, useCharacterData } from '../../Character/CharacterProvider'
import { SpellBlock } from '../../Spells/SpellBlock'
import {
  ConjurationSpellcastingPool,
  EnchantingSpellcastingPool,
  ResistDrain,
  SorcerySpellcastingPool,
} from '../../Spells/SpellDicePools'
import { ActiveSkill } from '../../System/Skill/ActiveSkill/ActiveSkillId'
import { DicePools } from '../../UI/DicePool'

export const SpellsPage: FC = () => {
  const character = useCharacterData()

  const sorcery = useActiveSkill(ActiveSkill.sorcery)
  const conjuration = useActiveSkill(ActiveSkill.conjuration)
  const enchanting = useActiveSkill(ActiveSkill.enchanting)

  if (!character) return null
  const spells = character.spells || []

  return (
    <Stack gap={1}>
      <Typography variant={'h4'}>Spells</Typography>

      <DicePools>
        {sorcery && <SorcerySpellcastingPool />}
        {conjuration && <ConjurationSpellcastingPool />}
        {enchanting && <EnchantingSpellcastingPool />}
        <ResistDrain />
      </DicePools>

      {spells.map(spell => (
        <SpellBlock key={spell.id} spell={spell} />
      ))}
    </Stack>
  )
}
