declare module '@rails/activestorage' {
  export class DirectUpload {
    constructor(file: File, url: string, delegate?: any);
    
    create(callback: (error: Error | null, blob: {
      signed_id: string;
      key: string;
      filename: string;
      content_type: string;
      metadata: Record<string, any>;
      service_name: string;
      byte_size: number;
      checksum: string;
    }) => void): void;
  }
}
