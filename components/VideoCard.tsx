import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Play, Info } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";

dayjs.extend(relativeTime);

interface Video {
  publicId: string;
  title: string;
  description: string;
  duration: number;
  originalSize: string | number;
  compressedSize: string | number;
  createdAt: string | Date;
}

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "webp",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100,
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="group glass-card rounded-3xl overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Preview Section */}
      <div className="aspect-video relative overflow-hidden bg-foreground/5">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Info size={24} className="text-foreground/20" />
              <p className="text-[10px] uppercase font-bold text-foreground/40">Preview Unavailable</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover transition-transform duration-700 scale-110"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}
        
        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg glass-panel text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1 shadow-lg">
          <Play size={10} fill="currentColor" />
          Preview
        </div>

        <div className="absolute bottom-3 right-3 glass-panel px-3 py-1 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
          <Clock size={14} />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold truncate group-hover:text-primary transition-colors">
            {video.title}
          </h2>
          <p className="text-xs text-foreground/50 font-medium">
            Added {dayjs(video.createdAt).fromNow()}
          </p>
        </div>

        <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed h-10">
          {video.description || "No description provided for this video asset."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="p-3 rounded-2xl bg-foreground/5 border border-foreground/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-foreground/40">
              <FileUp size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Original</span>
            </div>
            <span className="text-sm font-bold">{formatSize(Number(video.originalSize))}</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-500/60">
              <FileDown size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Small</span>
            </div>
            <span className="text-sm font-bold text-emerald-500">{formatSize(Number(video.compressedSize))}</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-foreground/30 uppercase">Efficiency</span>
             <span className="text-lg font-black text-emerald-500">
               {compressionPercentage}% <span className="text-[10px] font-medium text-foreground/40">saved</span>
             </span>
          </div>
          
          <button
            className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
