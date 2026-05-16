import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmy9e7lnh",
  api_key: process.env.CLOUDINARY_API_KEY || "564391932836777",
  api_secret: process.env.CLOUDINARY_API_SECRET || "SK7ABOAFu_ICbm0LwFgR0ASP998",
});




  interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any;
  }
  
export async function POST(req: NextRequest) {
    console.log("POST /api/video-upload started");
    try {
        const { userId } = await auth();
        console.log("Auth check - userId:", userId);
        
        if (!userId) {
            console.error("Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        console.log("FormData parsed successfully");
        
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const originalSize = formData.get("originalSize") as string | null;

        console.log("Request payload:", { 
            title, 
            description, 
            originalSize, 
            fileName: file?.name, 
            fileSize: file?.size 
        });

        if (!title || !originalSize) {
            console.error("Missing required fields - title or originalSize");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!file) {
            console.error("No file found in formData");
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("Converting file to ArrayBuffer...");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log("Buffer created, size:", buffer.length);

        console.log("Starting Cloudinary upload_stream...");
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder: "video-uploads", 
                    resource_type: "video",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "mp4",
                        }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload_stream callback ERROR:", error);
                        reject(error);
                    }
                    else {
                        console.log("Cloudinary upload_stream callback SUCCESS");
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        console.log("Cloudinary upload complete. Public ID:", result.public_id);
        console.log("Result stats - bytes:", result.bytes, "duration:", result.duration);

        console.log("Saving to database via Prisma...");
        const video = await prisma.video.create({
            data: {
                title,
                description: description || "",
                publicId: result.public_id,
                originalSize: parseInt(originalSize),
                duration: result.duration || 0,
                compressedSize: result.bytes,
                userId,
            }
        });

        console.log("Prisma record created. Video ID:", video.id);
        return NextResponse.json({ video }, { status: 200 });
    }
    catch (error: any) {
        console.error("CAUGHT EXCEPTION in video-upload route:", error);
        return NextResponse.json(
            { 
                error: "Internal Server Error", 
                message: error.message || "Unknown error",
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            }, 
            { status: 500 }
        );
    }
}




