/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "gateway.pinata.cloud",
      "rose-tough-aardwolf-788.mypinata.cloud", // Your custom Pinata gateway
    ],
  },
};

module.exports = nextConfig;
