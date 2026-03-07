// ✅ SECURITY: Remove direct Pinata usage from frontend
// Pinata uploads should be handled by backend API routes for security

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

export async function uploadToPinata(file: File): Promise<string> {
  // Validate file input
  if (!file) {
    throw new Error("No file provided");
  }

  if (!(file instanceof File)) {
    throw new Error(`Expected File object, got ${typeof file}`);
  }

  if (file.size === 0) {
    throw new Error("File is empty");
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size must be less than 10MB");
  }

  console.log("Uploading file:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  // ✅ SECURITY: Use backend API route instead of direct Pinata calls
  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Backend /api/upload responds with:
    // { success: true, ipfsUrl, ipfsHash }
    if (!result.success) {
      throw new Error(result.message || "Upload failed");
    }

    const ipfsHash: string | undefined =
      result.ipfsHash || result.data?.IpfsHash || result.data?.ipfsHash;

    const ipfsUrl: string | undefined =
      result.ipfsUrl ||
      (ipfsHash && GATEWAY_URL
        ? `https://${GATEWAY_URL}/ipfs/${ipfsHash}`
        : undefined);

    if (!ipfsHash || !ipfsUrl) {
      throw new Error("Upload failed - no IPFS hash or URL returned");
    }

    console.log("File uploaded successfully:", ipfsUrl);

    return ipfsUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error instanceof Error ? error : new Error("Failed to upload file");
  }
}
