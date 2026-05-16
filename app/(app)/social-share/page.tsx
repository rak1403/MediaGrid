"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Download, Upload, Image as ImageIcon, Share2, Loader2, Sparkles } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-4xl font-black tracking-tight text-gradient">
          Social Media Creator
        </h1>
        <p className="text-foreground/60">
          Intelligently adapt your images for any platform using AI-powered cropping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-primary">
                <Upload size={16} />
                Step 1: Upload Asset
              </div>
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-foreground/40 group-hover:text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-foreground/40 mt-1">PNG, JPG, WebP up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Loader2 className="animate-spin text-primary" size={20} />
                <span className="text-sm font-medium">Uploading to Cloudinary...</span>
              </div>
            )}

            {uploadedImage && !isUploading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-primary">
                    <Share2 size={16} />
                    Step 2: Choose Platform
                  </div>
                  <select
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectedFormat(e.target.value as SocialFormat)
                    }
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format} className="bg-background">
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                  onClick={handleDownload}
                >
                  <Download size={20} />
                  Download for {selectedFormat.split(' ')[0]}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-4 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest">AI Preview</span>
              </div>
              <div className="text-[10px] font-medium text-foreground/40">
                {socialFormats[selectedFormat].width} x {socialFormats[selectedFormat].height}
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8 bg-black/20">
              {!uploadedImage ? (
                <div className="text-center space-y-3 opacity-20">
                  <ImageIcon size={64} className="mx-auto" />
                  <p className="text-sm font-medium">Upload an image to see the preview</p>
                </div>
              ) : (
                <div className="relative group max-w-full shadow-2xl shadow-black/50">
                  {isTransforming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg gap-3">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                      <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Transforming...</span>
                    </div>
                  )}
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="transition-opacity duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

