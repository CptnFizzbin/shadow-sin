class Gear < ApplicationRecord
  belongs_to :character
  belongs_to :gear, primary_key: :parent_id
  has_many :gear

  validates_presence_of :character

  validates_presence_of :data
end
