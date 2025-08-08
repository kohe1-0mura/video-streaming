class Video < ApplicationRecord
  has_one_attached :file  
  has_one_attached :thumbnail
end
