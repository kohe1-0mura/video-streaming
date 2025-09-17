"use client"

import { DirectUpload } from "@rails/activestorage"
import React, { useRef } from "react"
import { useToast } from "@chakra-ui/react"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL!

type DirectUploadBlob = { signed_id: string }

export default function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const directUpload = (file: File, groupId: string) =>
    new Promise<{ signed_id: string }>((resolve, reject) => {
      const url = `${API}/rails/active_storage/direct_uploads?group_id=${encodeURIComponent(groupId)}&upload_type=rails`
      new DirectUpload(file, url).create((err: Error | null, blob?: DirectUploadBlob) => {
        if (err) return reject(err)
        if (!blob) return reject(new Error("No blob returned"))
        resolve({ signed_id: blob.signed_id })
      })
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) {
      toast({ title: "エラー", description: "ファイルを選択してください。", status: "error" })
      return
    }

    toast({ title: "アップロード開始", description: "処理中...", status: "info" })

    try {
      const pre = await fetch(`${API}/videos/precreate`, { method: "POST" })
      const { id } = (await pre.json()) as { id: number }
      const { signed_id } = await directUpload(file, String(id))

      await fetch(`${API}/videos/${id}/update_with_hls`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video: { file: signed_id } }),
      })

      toast({ title: "完了", description: "アップロードしました。ffmpegでHLS変換中です。", status: "success" })
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      console.error(err)
      toast({ title: "失敗", description: "アップロードに失敗しました。", status: "error" })
    }
  }

  return (    
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 }}>
          ffmpeg HLS変換
        </h1>
        <p style={{ color: "#666", fontSize: 14 }}>
          このページではサーバー上でffmpegを使いHLS変換を行います
        </p>
      </div>
      
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
      
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link 
          href="/upload-aws" 
          style={{ 
            color: "#ff9800", 
            textDecoration: "underline",
            fontSize: 14 
          }}
        >
          MediaConvert での変換に切り替え
        </Link>
      </div>
    </div> 
  )
}
