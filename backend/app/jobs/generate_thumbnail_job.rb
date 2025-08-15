class GenerateThumbnailJob < ApplicationJob
  queue_as :default

  def perform(id)
    video = Video.find_by(id: id)
    return unless video&.file&.attached?

    Dir.mktmpdir do |dir|
      out = File.join(dir, "thumbnail.jpg")

      video.file.blob.open do |src|
        thumbnail = system("ffmpeg", "-y", "-ss", "1", "-i", src.path,
                    "-frames:v", "1", "-vf", "scale=320:-1",
                    out, out: File::NULL, err: File::NULL)
        return unless thumbnail && File.size?(out)
      end

      video.thumbnail.purge_later if video.thumbnail.attached?
      video.thumbnail.attach(
        io: File.open(out, "rb"),
        filename: "thumbnail.jpg",
        content_type: "image/jpeg",
        key: "videos/#{video.id}/thumbnail.jpg"
      )
    end
  end
end
