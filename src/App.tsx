// src/App.tsx
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import axios from "axios";

function App() {
  const [mergedVideo, setMergedVideo] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0); // for forcing re-render

  const BASE_URL = import.meta.env.VITE_API_URL;

  const videoUrl = mergedVideo
    ?`${BASE_URL}/merged/${mergedVideo}`
    : null;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-10" style={{ backgroundImage: "url('src/assets/cricket.png')" }}>
  
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🏏 CricMoments 🏏 </h1>

      <UploadForm key={resetSignal} onUploadSuccess={setMergedVideo} />

      {videoUrl && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Here is your CricMoments ❣️</h2>

          <video
            controls
            className="max-w-xl w-full rounded-lg shadow-md"
            src={videoUrl}
          />

          <a
            href={videoUrl}
            download="CricMoments_Highlights.mp4"
            className="mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
          >
            ⬇️ Download Video
          </a>
        </div>
      )}
    <button
  onClick={async () => {
    try {
      await axios.post(`${BASE_URL}/api/clear`);
      setMergedVideo(null);
      setResetSignal((prev) => prev + 1); // trigger reset in UploadForm
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Clear failed", err);
    }
  }}
  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
>
  🧹 Clear
</button>
    </div>
  );
}

export default App;
