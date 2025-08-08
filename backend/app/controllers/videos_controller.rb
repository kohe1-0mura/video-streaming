class VideosController < ApplicationController
  def index
    videos = Video.with_attached_file.with_attached_thumbnail
                  .order(id: :desc).map { |v| serialize(v) }
    render json: videos
  end

  def show
    render json: serialize(Video.find(params[:id]))
  end

  def create
    v = Video.new(group_id: video_params[:group_id])
    v.file.attach(video_params[:file])
    v.thumbnail.attach(video_params[:thumbnail]) if video_params[:thumbnail].present?
    v.save!
    render json: { id: v.id }, status: :created
  end

  private

  def video_params
    params.require(:video).permit(:file, :thumbnail, :group_id)
  end

  def serialize(video)
    {
      id:            video.id,
      thumbnail_url: (video.thumbnail.attached? ? rails_blob_url(video.thumbnail, only_path: false) : nil),
      stream_url:    (video.file.attached? ? rails_blob_url(video.file, disposition: :inline, only_path: false) : nil)
    }
  end
end