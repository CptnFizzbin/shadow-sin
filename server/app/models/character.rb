class Character < ApplicationRecord
  belongs_to :user
  has_many :gear

  validates_presence_of :user

  validates_presence_of :name
  validates_uniqueness_of :name, :scope => :user

  def addGear(data)
    return Gear.create!({ data: data, character: self })
  end
end