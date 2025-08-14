class AddHlsColumnsToVideos < ActiveRecord::Migration[8.0]
  def change
    add_column :videos, :status, :integer, null: false, default: 0
    add_column :videos, :hls_master_key, :string

    add_index :videos, :status
    add_index :videos, :hls_master_key
  end
end
