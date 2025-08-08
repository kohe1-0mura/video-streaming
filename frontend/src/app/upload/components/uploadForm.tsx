"use client"

import { DirectUpload } from "@rails/activestorage"
import React, { useRef } from "react"
import { useToast } from "@chakra-ui/react"
import { extractThumbnail } from "@/lib/thumbnail"
import { directUpload } from "@/lib/activestorage"

const API = process.env.NEXT_PUBLIC_API_URL!

async function createVideoRecord(opts: {
  fileSignedId: string
  thumbnailSignedId?: string
  groupId: string
  apiBase?: string
}): Promise<void> {
  const api = opts.apiBase ?? API
  const res = await fetch(`${api}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      video: {
        file: opts.fileSignedId,
        thumbnail: opts.thumbnailSignedId,
        group_id: opts.groupId,
      },
    }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(`POST /videos failed: ${res.status} ${msg}`)
  }
}

export default function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) {
      toast({ title: "エラー", description: "ファイルを選択してください。", status: "error" })
      return
    }

    const groupId = crypto.randomUUID()
    toast({ title: "アップロード開始", description: "処理中...", status: "info" })

    try {
      const thumbFile = await extractThumbnail(file, 1)

      const [videoBlob, thumbBlob] = await Promise.all([
        directUpload(file, groupId),
        directUpload(thumbFile, groupId),
      ])

      await createVideoRecord({
        fileSignedId: videoBlob.signed_id,
        thumbnailSignedId: thumbBlob.signed_id,
        groupId,
      })

      toast({ title: "完了", description: "アップロードしました。", status: "success" })
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      console.error(err)
      toast({ title: "失敗", description: "アップロードに失敗しました。", status: "error" })
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          padding: 30,
          border: "2px dashed #ddd",
          borderRadius: 10,
          backgroundColor: "#fafafa",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <label
            style={{
              display: "block",
              marginBottom: 10,
              fontSize: 16,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            動画ファイルを選択してください
          </label>
          <input type="file" ref={inputRef} accept="video/*" required />
        </div>
        <button
          type="submit"
          style={{
            padding: "12px 30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          アップロード
        </button>
      </form>
    </div>
  )
}
