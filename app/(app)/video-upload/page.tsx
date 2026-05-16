"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, Video, X, CheckCircle2, AlertCircle, Loader2, Sparkles, FileText, Type } from "lucide-react";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

  useEffect(() => {
    // Cleanup preview URL to avoid memory leaks
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadStatus("error");
        setErrorMessage("File size exceeds 70MB limit.");
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setUploadStatus("idle");
      // Auto-set title from filename if empty
      if (!title) setTitle(selectedFile.name.split('.')[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("idle");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      setUploadStatus("success");
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/home");
      }, 2000);
      
    } catch (error: any) {
      console.error(error);
      setUploadStatus("error");
      setErrorMessage(error.response?.data?.error || "Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-4xl font-black tracking-tight text-gradient">
          Upload Content
        </h1>
        <p className="text-foreground/60">
          Securely upload your videos for AI-powered processing and global delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <Type size={14} />
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <FileText size={14} />
                  Description
                </label>
                <textarea
                  placeholder="What's this video about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <Video size={14} />
                  Video Source
                </label>
                
                {!file ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="border-2 border-dashed border-foreground/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="text-foreground/40 group-hover:text-primary" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">Drop your video here</p>
                        <p className="text-sm text-foreground/40 mt-1">MP4, WebM or OGG (Max 70MB)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                        <Video size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-foreground/50 uppercase font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === "success" && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 animate-in slide-in-from-top-2">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold">Upload successful! Redirecting to dashboard...</span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 animate-in slide-in-from-top-2">
                <AlertCircle size={20} />
                <span className="text-sm font-bold">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full h-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Processing Media...</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Initialize Upload</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col min-h-[400px]">
             <div className="p-4 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Source Preview</span>
                </div>
                <span className="text-[10px] font-medium text-foreground/40">Local Draft</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center bg-black/40">
                {previewUrl ? (
                  <video 
                    src={previewUrl} 
                    className="w-full h-full object-contain max-h-[500px]" 
                    controls 
                  />
                ) : (
                  <div className="text-center space-y-4 opacity-20 px-8">
                    <div className="w-20 h-20 bg-foreground/10 rounded-full flex items-center justify-center mx-auto">
                       <Video size={40} />
                    </div>
                    <p className="text-sm font-medium">Select a video file to see a preview before uploading</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;

