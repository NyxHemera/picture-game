class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login_id, :unique => true, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :photo_url
      t.string :email, null: false
      t.integer :games_created
      t.integer :games_completed
      t.string :remember_token
      t.string :password_digest, null: false

      t.timestamps null: false
    end
  end
end
