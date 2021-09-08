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
require 'rails_helper'

RSpec.describe Gear, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
