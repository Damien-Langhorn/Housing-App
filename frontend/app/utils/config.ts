// ✅ Frontend configuration - only public environment variables
export const config = {
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
  databaseUrl: process.env.NEXT_PUBLIC_DATABASE_URL,
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

// ✅ Validate configuration
if (!config.gatewayUrl) {
  throw new Error("NEXT_PUBLIC_GATEWAY_URL is required");
}

if (!config.databaseUrl) {
  throw new Error("NEXT_PUBLIC_DATABASE_URL is required");
}

if (!config.clerkPublishableKey) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required");
}
