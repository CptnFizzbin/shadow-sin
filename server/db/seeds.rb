# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

zera_user = User.create({
  username: "Zeragamba"
})

artemis = Character.create({
  user: zera_user,
  name: 'Artemis',
  data: {
    'dataVersion' => 1,
    'name' => 'Artemis',
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

    'skills' => [
      {
        'type' => 'active',
        'id' => 'firearms',
        'name' => 'Firearms',
        'rank' => 3,
        'attr' => 'agility',
        'speciality' => 'Automatics',
        'expertise' => nil,
      },
      {
        'type' => 'active',
        'id' => 'electronics',
        'name' => 'Electronics',
        'rank' => 4,
        'attr' => 'logic',
        'speciality' => nil,
        'expertise' => nil,
      },
      {
        'type' => 'active',
        'id' => 'cracking',
        'name' => 'Cracking',
        'rank' => 3,
        'attr' => 'logic',
        'altAttr' => 'intuition',
        'speciality' => nil,
        'expertise' => nil,
      },
      {
        'type' => 'active',
        'id' => 'piloting',
        'name' => 'Piloting',
        'rank' => 6,
        'attr' => 'logic',
        'speciality' => 'Ground Craft',
        'expertise' => nil,
      },
      {
        'type' => 'active',
        'id' => 'engineering',
        'name' => 'Engineering',
        'rank' => 5,
        'attr' => 'logic',
        'altAttr' => 'intuition',
        'speciality' => nil,
        'expertise' => nil,
      },
      {
        'type' => 'language',
        'id' => 'english',
        'name' => 'English',
        'rank' => 'native',
      },
      {
        'type' => 'language',
        'id' => 'elven',
        'name' => 'Elven',
        'rank' => 'speciality',
      },
      {
        'type' => 'knowledge',
        'id' => 'droneModels',
        'name' => 'Drone Models',
      },
      {
        'type' => 'knowledge',
        'id' => 'popCulture',
        'name' => '80/90s Pop Culture',
      },
      {
        'type' => 'knowledge',
        'id' => 'trideoSeries',
        'name' => 'Trideo Series',
      },
      {
        'type' => 'knowledge',
        'id' => 'securitySystems',
        'name' => 'Security Systems',
      },
      {
        'type' => 'knowledge',
        'id' => 'virtualNightclubs',
        'name' => 'Virtual Nightclubs',
      },
      {
        'type' => 'knowledge',
        'id' => 'techCompanies',
        'name' => 'Tech Companies',
      },
    ],
  }
})
