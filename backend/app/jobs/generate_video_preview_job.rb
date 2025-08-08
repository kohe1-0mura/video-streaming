class GenerateVideoPreviewJob < ApplicationJob
  queue_as :default

  def perform(video_id)
    video = Video.find_by(id: video_id)
    return unless video&.file&.attached?
    return unless video.file.blob.previewable?

    video.file.preview(resize_to_limit: [320, 180]).processed
  end
end
