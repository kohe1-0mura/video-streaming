class AddGroupIdToVideos < ActiveRecord::Migration[8.0]
  def change
    add_column :videos, :group_id, :string
    add_index :videos, :group_id
  end
end
