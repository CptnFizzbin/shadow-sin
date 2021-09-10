# == Schema Information
#
# Table name: characters
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
# @!attribute user_id
#   @return [String]
#
# Indexes
#
#  index_characters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Character < ApplicationRecord
  belongs_to :user

  validates_presence_of :user
  validates_presence_of :data
end
