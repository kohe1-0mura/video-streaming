class VideosController < ApplicationController
  def index
    videos = Video.with_attached_file.with_attached_thumbnail
                  .order(id: :desc).map { |v| serialize(v) }
    render json: videos
  end

  def show
    render json: serialize(Video.find(params[:id]))
  end

  def precreate
    v = Video.create!
    render json: { id: v.id }
  end

  def update
    v = Video.find(params[:id])
    v.file.attach(params.require(:video).permit(:file)[:file])
    v.group_id ||= v.id.to_s
    v.save!
    GenerateThumbnailJob.perform_later(v.id)
    head :no_content
  end

  private

  def serialize(video)
    {
      id: video.id,
      thumbnail_url: (video.thumbnail.attached? ? rails_blob_url(video.thumbnail, only_path: false) : nil),
      stream_url:    (video.file.attached? ? rails_blob_url(video.file, disposition: :inline, only_path: false) : nil)
    }
  end
end
