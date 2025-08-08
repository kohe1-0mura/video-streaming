class Video < ApplicationRecord
  has_one_attached :file  

  after_commit -> { GenerateVideoPreviewJob.perform_later(id) }, on: :create
end
