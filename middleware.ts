// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
	"/login",
	"/subscription",
	"/cancellation",
	"/confirmation",
]);

const isIgnoredRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware((auth, req) => {
	if (isIgnoredRoute(req)) {
		return;
	}

	if (!isPublicRoute(req) && !auth().userId) {
		const signInUrl = new URL("/sign-in", req.url);
		return NextResponse.redirect(signInUrl);
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
