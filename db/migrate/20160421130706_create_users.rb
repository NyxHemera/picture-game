class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :first_name
      t.string :last_name
      t.string :photo_url
      t.string :email
      t.integer :games_created
      t.integer :games_completed

      t.timestamps null: false
    end
  end
end
