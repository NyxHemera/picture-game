class AddAvatarToUsers < ActiveRecord::Migration
  def change
	  def self.up
	    add_attachment :users, :avatar
	  end

	  def self.down
	    remove_attachment :users, :avatar
	  end
  end
end
