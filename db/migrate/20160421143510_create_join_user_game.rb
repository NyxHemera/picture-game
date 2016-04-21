class CreateJoinUserGame < ActiveRecord::Migration
  def change
    create_table :join_user_games do |t|
      t.string :user
      t.string :game
    end
  end
end
