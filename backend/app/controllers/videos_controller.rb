class VideosController < ApplicationController
  def create
    video = Video.create!
    video.file.attach(params.require(:video).permit(:file)[:file])
    render json: { id: video.id, created_at: video.created_at }
  end
end