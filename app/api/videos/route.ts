import { NextRequest, NextResponse} from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return new NextResponse("Error fetching videos", { status: 500 });
    }
}