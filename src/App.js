import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState } from "react";
import UploadForm from "./components/UploadForm";
import axios from "axios";
function App() {
    const [mergedVideo, setMergedVideo] = useState(null);
    const [resetSignal, setResetSignal] = useState(0); // for forcing re-render
    const BASE_URL = import.meta.env.VITE_API_URL;
    const videoUrl = mergedVideo
        ? `${BASE_URL}/merged/${mergedVideo}`
        : null;
    return (_jsxs("div", { className: "min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-10", style: { backgroundImage: "url('src/assets/cricket.png')" }, children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-blue-700", children: "\uD83C\uDFCF CricMoments \uD83C\uDFCF " }), _jsx(UploadForm, { onUploadSuccess: setMergedVideo }, resetSignal), videoUrl && (_jsxs("div", { className: "mt-10 text-center", children: [_jsx("h2", { className: "text-xl font-semibold mb-2 text-gray-800", children: "Here is your CricMoments \u2763\uFE0F" }), _jsx("video", { controls: true, className: "max-w-xl w-full rounded-lg shadow-md", src: videoUrl }), _jsx("a", { href: videoUrl, download: "CricMoments_Highlights.mp4", className: "mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all", children: "\u2B07\uFE0F Download Video" })] })), _jsx("button", { onClick: async () => {
                    try {
                        await axios.post(`${BASE_URL}/api/clear`);
                        setMergedVideo(null);
                        setResetSignal((prev) => prev + 1); // trigger reset in UploadForm
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    catch (err) {
                        console.error("Clear failed", err);
                    }
                }, className: "mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all", children: "\uD83E\uDDF9 Clear" })] }));
}
export default App;
