class CreateGears < ActiveRecord::Migration[6.1]
  def change
    create_table :gear, id: :uuid do |t|
      t.string :name
      t.uuid :character_id
      t.json :data

      t.timestamps
    end
  end
end
