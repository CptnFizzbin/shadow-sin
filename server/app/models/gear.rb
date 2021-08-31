class Gear < ApplicationRecord
  belongs_to :character

  validates_presence_of :character

  validates_presence_of :data
end
