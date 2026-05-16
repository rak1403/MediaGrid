import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isWebpackDefaultLayer } from "next/dist/build/utils";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos",
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")
    //logged in and trying to access the dashboard or a public route
    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url));
    }
    if (!userId) {
      //not logged in and trying to access a protected route
      if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      //if the request is for an API route and the user is not authenticated, return a 401 response
      if (isApiRequest && !isPublicApiRoute(req)) {
        return new NextResponse("Unauthorized Please login first", {
          status: 401,
        });
      }
    }
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
