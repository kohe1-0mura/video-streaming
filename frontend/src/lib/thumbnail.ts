export async function extractThumbnail(
  file: File,
  atSec = 1,
  targetW = 320
): Promise<File> {
  const url = URL.createObjectURL(file)
  try {
    const video = document.createElement("video")
    video.src = url
    video.muted = true
    video.playsInline = true

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => {
        video.currentTime = Math.min(atSec, video.duration || atSec)
      }
      video.onseeked = () => resolve()
      video.onerror = () => reject(new Error("video load error"))
    })

    const w = video.videoWidth, h = video.videoHeight
    const targetH = Math.round(h * (targetW / w))
    const canvas = Object.assign(document.createElement("canvas"), { width: targetW, height: targetH })
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(video, 0, 0, targetW, targetH)

    const blob: Blob = await new Promise((res) => {
      if (canvas.toBlob) {
        canvas.toBlob(b => res(b!), "image/jpeg", 0.8)
      } else {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        const bin = atob(dataUrl.split(",")[1])
        const arr = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
        res(new Blob([arr], { type: "image/jpeg" }))
      }
    })

    return new File([blob], "thumbnail.jpg", { type: "image/jpeg" })
  } finally {
    URL.revokeObjectURL(url)
  }
}
