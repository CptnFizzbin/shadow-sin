artemis = Character.find_by_name("Artemis")

artemis.addGear({
  'name' => 'Control Rig',
  'gearType' => 'controlRig',
  'type' => 'Headwear Augment',
  'avail' => { 'rarity' => 3, 'license' => true },
  'cost' => 60_000,
  'augmentSlot' => 'headware',

  'attributes' => {
    'augment.grade' => 'used',
    'controlRig.rating' => 2,
  },
})

# ==== WEAPONS =====
smartGunIntMod = {
  'name' => 'Smart Gun Int.',
  'source' => { 'book' => 'COR', 'page' => 260 },
  'gearType' => 'weaponMod',
  'type' => 'Weapon Mod',
  'cost' => 500,

  'slot' => nil,
  'removable' => false,
  'wirelessBonus' => {
    'enabled' => true,
    'description' =>
      'You gain a +1 dice pool bonus. Gain a bonus Minor Action on a turn when ' +
        'you use the Reload Smartgun or Change Device Mode actions to eject a ' +
        'clip or change fire mode.',
  },
}

fnP93 = artemis.addGear({
  'name' => 'FN P93 Praetor',
  'source' => { 'book' => 'COR', 'page' => 254 },
  'gearType' => 'weapon',
  'type' => 'Submachine Gun',
  'avail' => { 'rarity' => 4, 'license' => true },
  'cost' => 925,

  'attributes' => {
    'weapon.dv' => '4P',
    'weapon.modes' => 'SA/BF/FA',
    'weapon.attackRatings' => '9/12/7/-/-',
    'weapon.ammo' => '50(c)',
  },

  'specialtySkill' => 'firearms',
  'specialtyName' => 'automatics',
})

fnP93.addGear({
  'name' => 'Rigid Stock',
  'source' => { 'book' => 'COR', 'page' => 254 },
  'gearType' => 'weaponMod',
  'type' => 'Weapon Mod',

  'slot' => nil,
  'removable' => false,
})
fnP93.addGear({
  'source' => { 'book' => 'COR', 'page' => 254 },
  'gearType' => 'weaponMod',
  'name' => 'Laser sight',
  'type' => 'Weapon Mod',

  'slot' => 'topOrUnder',
})
fnP93.addGear({
  'source' => { 'book' => 'COR', 'page' => 254 },
  'gearType' => 'weaponMod',
  'name' => 'Flashlight',
  'type' => 'Weapon Mod',

  'slot' => 'topOrUnder',
})
fnP93.addGear(smartGunIntMod)

coltL36 = artemis.addGear({
  'source' => { 'book' => 'COR', 'page' => 252 },
  'gearType' => 'weapon',
  'name' => 'Colt America L36',
  'type' => 'Light Pistol',
  'avail' => { 'rarity' => 2, 'license' => true },
  'cost' => 230,

  'attributes' => {
    'weapon.dv' => '2P',
    'weapon.modes' => 'SA',
    'weapon.attackRatings' => '8/8/6/-/-',
    'weapon.ammo' => '11(c)',
  },

  'wirelessBonus' => {
    'enabled' => true,
    'description' => 'The user can alter ownership with a Minor Action',
  },

  'specialtySkill' => 'firearms',
  'specialtyName' => 'automatics',
})
coltL36.addGear(smartGunIntMod)

ares6 = artemis.addGear({
  'source' => { 'book' => 'COR', 'page' => 252 },
  'gearType' => 'weapon',
  'name' => 'Ares Predator VI',
  'type' => 'Heavy Pistol',
  'avail' => { 'rarity' => 2, 'license' => true },
  'cost' => 750,

  'attributes' => {
    'weapon.dv' => '3P',
    'weapon.modes' => 'SA/BF',
    'weapon.attackRatings' => '10/10/8/-/-',
    'weapon.ammo' => '15(c)',
  },

  'specialtySkill' => 'firearms',
  'specialtyName' => 'pistols',
})
ares6.addGear(smartGunIntMod)

rcc = artemis.addGear({
  'gearType' => 'rcc',
  'name' => 'Proteus Poseidon',
  'type' => 'RCC',
  'avail' => { 'rarity' => 6, 'license' => true },
  'cost' => 68_000,

  'attributes' => {
    'rcc.deviceRating' => 5,
    'rcc.dataProcessing' => 5,
    'rcc.firewall' => 5,
  },

  'slavedAutosofts' => [],
})

autosofts = [
  rcc.addGear({
    'gearType' => 'autosoft',
    'name' => 'FN-HAR Targeting',
    'type' => 'Targeting Autosoft',
    'avail' => { 'rarity' => 8 },
    'cost' => 4_000,

    'attributes' => {
      'autosoft.rating' => 8,
      'autosoft.weapon' => 'FN-HAR',
      'autosoft.attr' => 'Sensor',
    },
  }),
  rcc.addGear({
    'gearType' => 'autosoft',
    'name' => 'Clearsight',
    'type' => 'Autosoft',
    'avail' => { 'rarity' => 7 },
    'cost' => 3_500,

    'attributes' => {
      'autosoft.rating' => 7,
      'autosoft.skill' => 'Perception',
      'autosoft.attr' => 'Sensor',
    },
  }),
  rcc.addGear({
    'gearType' => 'autosoft',
    'name' => 'Evasion',
    'type' => 'Autosoft',
    'avail' => { 'rarity' => 5 },
    'cost' => 2_500,

    'attributes' => {
      'autosoft.rating' => 5,
      'autosoft.skill' => 'Evasion',
      'autosoft.attr' => 'Pilot',
    },
  }),
  rcc.addGear({
    'gearType' => 'autosoft',
    'name' => 'Maneuvering',
    'type' => 'Autosoft',
    'avail' => { 'rarity' => 5 },
    'cost' => 2_500,

    'attributes' => {
      'autosoft.rating' => 5,
      'autosoft.skill' => 'Piloting',
      'autosoft.attr' => 'Pilot',
    },
  }),
  rcc.addGear({
    'gearType' => 'autosoft',
    'name' => 'Electronic Warfare',
    'type' => 'Autosoft',
    'avail' => { 'rarity' => 7 },
    'cost' => 3_500,

    'attributes' => {
      'autosoft.rating' => 7,
      'autosoft.skill' => 'Cracking',
      'autosoft.attr' => 'Sensor',
    },
  }),
]

rcc[:data]['slavedAutosofts'] = autosofts.collect(&:id)
rcc.save
