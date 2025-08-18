import { DirectUpload } from "@rails/activestorage"

export type DirectUploadResult = { signed_id: string }

export async function directUpload(
  file: File,
  groupId: string,
  apiBase = process.env.NEXT_PUBLIC_API_URL!
): Promise<DirectUploadResult> {
  const endpoint = `${apiBase}/rails/active_storage/direct_uploads?group_id=${encodeURIComponent(groupId)}`
  const tryOnce = () =>
    new Promise<DirectUploadResult>((resolve, reject) => {
      new DirectUpload(file, endpoint).create((err: any, blob: any) => {
        if (err) return reject(err)
        resolve({ signed_id: blob.signed_id })
      })
    })

  try {
    return await tryOnce()
  } catch (e) {
    await new Promise(r => setTimeout(r, 200))
    return await tryOnce()
  }
}
