artemis = Character.create({
  user: User.find_by_username!('zeragamba'),
  name: 'Artemis',
  data: {
    'dataVersion' => 1,
    'metaType' => 'Elf',
    'karma' => 7,
    'nuyen' => 14_420,

    'attributes' => {
      'char.body' => 1,
      'char.agility' => 3,
      'char.reaction' => 1,
      'char.strength' => 1,
      'char.willpower' => 2,
      'char.logic' => 7,
      'char.intuition' => 5,
      'char.charisma' => 2,
      'char.edge' => 4,
      'char.essence' => 2.1,
    },

    'skills' => []
  }
})

active_skills = [
  {
    'type' => 'active',
    'skillId' => 'firearms',
    'name' => 'Firearms',
    'rank' => 3,
    'attr' => 'agility',
    'speciality' => 'Automatics',
    'expertise' => nil,
  },
  {
    'type' => 'active',
    'skillId' => 'electronics',
    'name' => 'Electronics',
    'rank' => 4,
    'attr' => 'logic',
    'speciality' => nil,
    'expertise' => nil,
  },
  {
    'type' => 'active',
    'skillId' => 'cracking',
    'name' => 'Cracking',
    'rank' => 3,
    'attr' => 'logic',
    'altAttr' => 'intuition',
    'speciality' => nil,
    'expertise' => nil,
  },
  {
    'type' => 'active',
    'skillId' => 'piloting',
    'name' => 'Piloting',
    'rank' => 6,
    'attr' => 'logic',
    'speciality' => 'Ground Craft',
    'expertise' => nil,
  },
  {
    'type' => 'active',
    'skillId' => 'engineering',
    'name' => 'Engineering',
    'rank' => 5,
    'attr' => 'logic',
    'altAttr' => 'intuition',
    'speciality' => nil,
    'expertise' => nil,
  },
]

language_skills = [
  {
    'type' => 'language',
    'name' => 'English',
    'rank' => 'native',
  },
  {
    'type' => 'language',
    'name' => 'Elven',
    'rank' => 'speciality',
  },
  {
    'type' => 'language',
    'name' => 'Klingon',
    'rank' => 'basic',
  },
]

knowledge_skills = [
  {
    'type' => 'knowledge',
    'name' => 'Drone Models',
  },
  {
    'type' => 'knowledge',
    'name' => '80/90s Pop Culture',
  },
  {
    'type' => 'knowledge',
    'name' => 'Trideo Series',
  },
  {
    'type' => 'knowledge',
    'name' => 'Security Systems',
  },
  {
    'type' => 'knowledge',
    'name' => 'Virtual Nightclubs',
  },
  {
    'type' => 'knowledge',
    'name' => 'Tech Companies',
  },
]

artemis.data['skills'] = [
  *active_skills,
  *language_skills,
  *knowledge_skills,
]

require_relative './gear'
