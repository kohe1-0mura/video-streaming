"use client";

import { DirectUpload } from "@rails/activestorage";
import React, { useRef } from "react";
import { useToast } from "@chakra-ui/react";

const UploadForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: "エラー",
        description: "ファイルを選択してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "アップロード開始",
      description: "ファイルをアップロード中です...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });

    const upload = new DirectUpload(
      file,
      `${process.env.NEXT_PUBLIC_API_URL}/rails/active_storage/direct_uploads`
    );

    upload.create(async (error, blob) => {
      if (error) {
        toast({
          title: "アップロード失敗",
          description: "ファイルのアップロードに失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video: { file: blob.signed_id } }),
        });

        toast({
          title: "アップロード完了",
          description: "動画が正常にアップロードされました。",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // フォームをリセット
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (error) {
        toast({
          title: "保存失敗",
          description: "動画の保存に失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };
  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '30px',
        border: '2px dashed #ddd',
        borderRadius: '10px',
        backgroundColor: '#fafafa',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            動画ファイルを選択してください
          </label>
          <input
            type="file"
            ref={inputRef}
            accept="video/*"
            required
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                console.log("Selected file:", e.target.files[0].name);
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '12px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          アップロード
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
