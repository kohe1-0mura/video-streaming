class VideosController < ApplicationController
  def index
    videos = Video.where(status: :ready).with_attached_thumbnail
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

  def hls_complete
    v = Video.find(params[:id])
    body = request.request_parameters.presence || JSON.parse(request.raw_post) rescue {}
    master_key = body["master_key"].presence ||
                 "videos/#{v.group_id || v.id}/hls/master.m3u8"

    v.update!(status: :ready, hls_master_key: master_key)
    head :ok
  end

  private

  def serialize(video)
    {
      id: video.id,
      title: (video.file.attached? ? video.file.blob.filename.to_s : "無題"),
      created_at: video.created_at.iso8601,
      status: video.status,
      thumbnail_url: (video.thumbnail.attached? ? rails_blob_url(video.thumbnail, only_path: false) : nil),
      hls_url: video.hls_url
    }
  end
end
