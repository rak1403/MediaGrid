"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video as VideoIcon } from "lucide-react";
export interface Video {
  id: string;
  title: string;
  description: string;
  publicId: string;
  originalSize: number;
  compressedSize: number;
  duration: number;
  createdAt: Date;
}

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(" Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}.mp4`;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => console.error("Download failed:", error));
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-foreground/40 font-medium animate-pulse">Scanning MediaGrid...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-gradient">
            Library
          </h1>
          <p className="text-foreground/60">
            Manage and optimize your global media assets.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/40">
           Total Assets: <span className="text-foreground">{videos.length}</span>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-16 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-foreground/10 bg-transparent">
          <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20">
             <VideoIcon size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your grid is empty</h3>
            <p className="text-foreground/40 max-w-xs mx-auto">
              Upload your first video to see the power of AI-driven optimization.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = "/video-upload"}
            className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Upload Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default Home;
