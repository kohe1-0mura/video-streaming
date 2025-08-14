Rails.application.config.to_prepare do
  class ActiveStorage::DirectUploadsController < ActiveStorage::BaseController
    def create
      gid = params[:group_id].to_s
      raise ActionController::BadRequest, "group_id missing" if gid.blank? || gid == "undefined"

      filename = params.dig(:blob, :filename).to_s
      key = "videos/#{gid}/#{filename}"

      attrs = params.require(:blob)
                    .permit(:filename, :byte_size, :checksum, :content_type)
                    .to_h.symbolize_keys

      blob = ActiveStorage::Blob.create_before_direct_upload!(**attrs.merge(key: key))
      render json: direct_upload_json(blob)
    end
  end
end
