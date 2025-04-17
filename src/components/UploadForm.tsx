import React, { useEffect, useState } from "react";
import axios from "axios";



type Props = {
  onUploadSuccess: (videoFilename: string) => void;

};

const UploadForm: React.FC<Props> = ({ onUploadSuccess }) => {
  const [qualityMode, setQualityMode] = useState('quick');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");


  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleCancel = async () => {
    await axios.post(`${BASE_URL}/api/cancel`);
    setStatus("❌ Cancelled by user");
    setUploading(false);
    setProgress(0);
    setFile(null);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append('quality', qualityMode);

    try {
      setUploading(true);
      setProgress(0);
      setStatus("Processing...");

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        },
      });

      setStatus("Processing...");
      const { merged } = res.data;
      setStatus("✅ Done! Highlights ready.");
      onUploadSuccess(merged);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Upload Match Video</h2>

      <input
        type="file"
        accept="video/mp4"
        onChange={handleChange}
        className="w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

<div className="mb-4">
  <div className="font-semibold text-gray-700 mr-4">Export Quality:</div>
  <label className="mr-4">
    <input
      type="radio"
      name="quality"
      value="quick"
      checked={qualityMode === 'quick'}
      onChange={() => setQualityMode('quick')}
      className="mr-1"
    />
    Quick (⚡ Faster, May Lag)
  </label>
  <label>
    <input
      type="radio"
      name="quality"
      value="high"
      checked={qualityMode === 'high'}
      onChange={() => setQualityMode('high')}
      className="mr-1"
    />
    High Quality
  </label>
</div>


      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Processing..." : "Upload & Generate Highlights"}
      </button>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

        {uploading && (
        <button
        onClick={handleCancel}
        className="mt-2 w-full text-red-600 font-medium text-sm underline"
        >
        Cancel Processing
        </button>
        )}

      {status && (
        <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default UploadForm;
