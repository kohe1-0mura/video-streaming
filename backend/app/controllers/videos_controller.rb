class VideosController < ApplicationController
  def create
    video = Video.new
    signed_id = params.require(:video).fetch(:file)

    video.file.attach(signed_id)
    video.save!

    render json: { status: 200 }
  end
end