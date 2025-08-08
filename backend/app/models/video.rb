class Video < ApplicationRecord
  has_one_attached :file  
  has_one_attached :thumbnail

  # after_commit -> { GenerateVideoPreviewJob.perform_later(id) }, on: :create
end
