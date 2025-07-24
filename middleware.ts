import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/login",
	"/subscription",
	"/cancellation",
	"/confirmation",
]);

const isIgnoredRoute = createRouteMatcher(["/api/webhooks/stripe"]);

export default clerkMiddleware((auth, req) => {
	if (isIgnoredRoute(req)) return;

	if (!isPublicRoute(req)) {
		auth().protect();
	}
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
