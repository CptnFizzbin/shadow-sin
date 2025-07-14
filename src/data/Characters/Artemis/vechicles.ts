import { CharacterData } from "../../../Character/CharacterData"
import { GearType } from "../../../Gear/GearData"
import { RccData } from "../../../Gear/Rcc/RccData"
import { VehicleAttr } from "../../../Gear/Vehicles/VehicleAttr"
import { VehicleData } from "../../../Gear/Vehicles/VehicleData"
import {
  HardpointSize,
  SlotType,
  VehicleModAttr,
} from "../../../Gear/Vehicles/VehicleModData"
import { Specializations } from "../../../Skills"
import { addGear } from "../index"
import { riggerInterface } from "./drones"

export const addVehicles = (character: CharacterData, rcc: RccData): void => {
  addGear<VehicleData>(
    character,
    {
      id: "4a5eb8d5-004b-4cdd-bce5-e0db64a33639",
      gearType: GearType.vehicle,
      name: "Range Rover Model 2080",
      type: "Van",
      cost: 73_000,
      avail: { rarity: 2 },

      attributes: {
        [VehicleAttr.handling]: "4/5",
        [VehicleAttr.accel]: 12,
        [VehicleAttr.speedInterval]: 20,
        [VehicleAttr.topSpeed]: 160,
        [VehicleAttr.body]: 16,
        [VehicleAttr.armor]: 10,
        [VehicleAttr.pilot]: 4,
        [VehicleAttr.sensor]: 4,
        [VehicleAttr.seat]: 4,
      },

      slavedTo: rcc.id,
      pilotingSpeciality: "Ground Craft",

      hardpoints: {
        [HardpointSize.small]: 0,
        [HardpointSize.standard]: 3,
        [HardpointSize.large]: 1,
        [HardpointSize.huge]: 0,
      },

      modSlots: {
        [SlotType.chassis]: 16,
        [SlotType.powertrain]: 16,
        [SlotType.electronic]: 16,
      },
    },
    [
      addGear(character, {
        ...riggerInterface,
        id: "cebc1ac9-e097-44f6-9394-bc342a7f71a3",
      }),
      addGear(
        character,
        {
          id: "1497c961-81f4-4b75-aed6-90c345671188",
          name: "Medium Drone Rack",
          gearType: GearType.vehicleMod,
          type: "Core Mod",
          attributes: {
            [VehicleModAttr.hardpointSize]: HardpointSize.large,
            "Drone Capacity": "8 Medium",
          },
        },
        [
          addGear(character, {
            id: "4b7ed682-0404-4da1-8830-685a239e567e",
            name: "Expanded Drone Storage",
            gearType: GearType.vehicleMod,
            type: "Core Mod",
            attributes: {
              [VehicleModAttr.slotType]: SlotType.chassis,
              [VehicleModAttr.slotCost]: 7,
            },
          }),
        ],
      ),
    ],
  )

  addGear<VehicleData>(
    character,
    {
      id: "56333f13-e3e9-4506-a8db-86a7c23e2cc9",
      gearType: GearType.vehicle,
      name: "Russian Osprey 9",
      type: "VTOL",
      cost: 350_000,
      source: { book: "CRB", page: 299 },
      avail: { rarity: 2 },

      attributes: {
        [VehicleAttr.handling]: 3,
        [VehicleAttr.accel]: 35,
        [VehicleAttr.speedInterval]: 60,
        [VehicleAttr.topSpeed]: 420,
        [VehicleAttr.body]: 16,
        [VehicleAttr.armor]: 10,
        [VehicleAttr.pilot]: 2,
        [VehicleAttr.sensor]: 2,
        [VehicleAttr.seat]: 8,
      },

      slavedTo: rcc.id,
      pilotingSpeciality: Specializations.CRB.Piloting.Aircraft,

      hardpoints: {
        [HardpointSize.small]: 0,
        [HardpointSize.standard]: 5,
        [HardpointSize.large]: 0,
        [HardpointSize.huge]: 0,
      },

      modSlots: {
        [SlotType.chassis]: 16,
        [SlotType.powertrain]: 16,
        [SlotType.electronic]: 16,
      },
    },
    [
      addGear(character, {
        ...riggerInterface,
        id: "d04d8271-765c-44b3-a3fa-88683fd43119",
      }),
    ],
  )
}
