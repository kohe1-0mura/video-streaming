
import UploadForm from "./components/uploadForm";

const UploadPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          ファイルをアップロード
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '40px'
        }}>
          動画ファイルをアップロードして共有しましょう
        </p>
        <UploadForm />
      </div>
    </div>
  );
};

export default UploadPage;