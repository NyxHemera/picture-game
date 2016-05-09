class RemoveNullFromPhotoUrl < ActiveRecord::Migration
  def change
  	change_column :users, :photo_url, :string, :null => true
  end
end
