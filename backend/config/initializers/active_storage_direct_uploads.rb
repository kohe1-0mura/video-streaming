Rails.application.config.to_prepare do
  class ActiveStorage::DirectUploadsController < ActiveStorage::BaseController
    def create
      gid = params[:group_id].presence
      key = "videos/#{gid}/#{ActiveStorage::Blob.generate_unique_secure_token}"
      blob = ActiveStorage::Blob.create_before_direct_upload!(**blob_args.merge(key: key))
      render json: direct_upload_json(blob)
    end
  end
end