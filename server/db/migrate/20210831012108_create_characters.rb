class CreateCharacters < ActiveRecord::Migration[6.1]
  def change
    create_table :characters, id: :uuid do |t|
      t.string :name
      t.uuid :user_id
      t.json :data

      t.timestamps
    end
  end
end
