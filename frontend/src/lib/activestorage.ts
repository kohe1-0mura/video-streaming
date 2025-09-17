import { DirectUpload } from "@rails/activestorage"

export type DirectUploadResult = { signed_id: string }

type DirectUploadBlob = { signed_id: string }

export async function directUpload(
  file: File,
  groupId: string,
  apiBase = process.env.NEXT_PUBLIC_API_URL!
): Promise<DirectUploadResult> {
  const endpoint = `${apiBase}/rails/active_storage/direct_uploads?group_id=${encodeURIComponent(groupId)}`
  const tryOnce = () =>
    new Promise<DirectUploadResult>((resolve, reject) => {
      new DirectUpload(file, endpoint).create((err: Error | null, blob?: DirectUploadBlob) => {
        if (err) return reject(err)
        if (!blob) return reject(new Error("No blob returned"))
        resolve({ signed_id: blob.signed_id })
      })
    })

  try {
    return await tryOnce()
  } catch {
    await new Promise(r => setTimeout(r, 200))
    return await tryOnce()
  }
}
