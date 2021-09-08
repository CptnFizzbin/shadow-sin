# == Schema Information
#
# Table name: gear
#
# @!attribute id
#   @return [String]
# @!attribute data
#   @return [Hash]
# @!attribute name
#   @return [String]
# @!attribute created_at
#   @return [Time]
# @!attribute updated_at
#   @return [Time]
# @!attribute character_id
#   @return [String]
# @!attribute parent_id
#   @return [String]
#
# Indexes
#
#  index_gear_on_character_id  (character_id)
#  index_gear_on_parent_id     (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (parent_id => gear.id)
#
class Gear < ApplicationRecord
  belongs_to :character
  belongs_to :parent, class_name: "Gear", inverse_of: :nested_gear, optional: true
  has_many :nested_gear, class_name: "Gear", inverse_of: :parent

  validates_presence_of :character

  validates_presence_of :data

  before_create :set_name_from_data

  def set_name_from_data
    self.name ||= self.data['name']
  end

  def addGear(data)
    return Gear.create!({ data: data, parent: self, character: self.character})
  end
end
