// ✅ Frontend configuration - only public environment variables
export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend-url.onrender.com',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

// ✅ Validate configuration
if (!config.backendUrl) {
  console.warn("NEXT_PUBLIC_BACKEND_URL is not set, using default");
}

if (!config.clerkPublishableKey) {
  console.error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required");
}
