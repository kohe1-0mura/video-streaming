class Video < ApplicationRecord
  has_one_attached :file  
  has_one_attached :thumbnail
  has_one_attached :hls_playlist
end
