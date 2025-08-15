Rails.application.config.to_prepare do
  class ActiveStorage::DirectUploadsController < ActiveStorage::BaseController
    def create
      gid = params[:group_id].to_s
      raise ActionController::BadRequest, "group_id missing" if gid.blank? || gid == "undefined"

      upload_type = params[:upload_type].to_s
      
      filename = params.dig(:blob, :filename).to_s
      ext = File.extname(filename).downcase
      
      if upload_type == "rails"
        key = "videos/rails/#{gid}/#{SecureRandom.hex(16)}#{ext}"
      else
        key = "videos/mc/#{gid}/#{SecureRandom.hex(16)}#{ext}"
      end

      attrs = params.require(:blob)
                    .permit(:filename, :byte_size, :checksum, :content_type)
                    .to_h.symbolize_keys

      blob = ActiveStorage::Blob.create_before_direct_upload!(**attrs.merge(key: key))
      render json: direct_upload_json(blob)
    end
  end
end
