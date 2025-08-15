class GenerateHlsJob < ApplicationJob
  queue_as :default

  def perform(id)
    video = Video.find_by(id: id)
    return unless video&.file&.attached?

    Dir.mktmpdir do |dir|
      hls_dir  = File.join(dir, "hls")
      FileUtils.mkdir_p(hls_dir)
      playlist = File.join(hls_dir, "index.m3u8")
      segments = File.join(hls_dir, "%03d.ts")

      ok = false
      video.file.blob.open do |src|
        ok = system(
          "ffmpeg", "-y", "-i", src.path,
          "-c:v", "libx264", "-c:a", "aac",
          "-f", "hls",
          "-hls_time", "4",
          "-hls_list_size", "0",
          "-hls_segment_filename", segments,
          playlist,
          out: File::NULL, err: File::NULL
        )
      end
      return unless ok && File.exist?(playlist)

      video.hls_playlist.purge_later if video.hls_playlist.attached?
      video.hls_playlist.attach(
        io: File.open(playlist, "rb"),
        filename: "index.m3u8",
        content_type: "application/vnd.apple.mpegurl",
        key: "videos/rails/#{video.id}/hls/index.m3u8"
      )

      service  = ActiveStorage::Blob.service
      base_key = "videos/rails/#{video.id}/hls"
      Dir.glob(File.join(hls_dir, "*.ts")).sort.each do |seg|
        File.open(seg, "rb") do |f|
          service.upload("#{base_key}/#{File.basename(seg)}", f, content_type: "video/mp2t")
        end
      end
    end
  end
end
