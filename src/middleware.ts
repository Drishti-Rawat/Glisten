import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = [
  '/',
  '/api/product(.*)',
  '/api/webhook/clerk',
  '/sign-in(.*)',  // This will match all routes under /sign-in
  '/sign-up(.*)' 
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionId, redirectToSignIn } = await auth();

  if (!isPublicRoute(request)) {
    // If user is not authenticated, redirect to the sign-in page
    if (!userId || !sessionId) {
      return redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', '/',
    '/(api|trpc)(.*)',
  ],
};