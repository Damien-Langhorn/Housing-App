import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// This route now uploads directly to Pinata.
// Required env vars (server-side only, not NEXT_PUBLIC_):
// - PINATA_JWT
// - PINATA_GATEWAY_URL

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const PINATA_JWT = process.env.PINATA_JWT;
    const GATEWAY_URL = process.env.PINATA_GATEWAY_URL;

    if (!PINATA_JWT || !GATEWAY_URL) {
      console.error("PINATA_JWT or PINATA_GATEWAY_URL not configured");
      return NextResponse.json(
        { error: "Upload service not configured" },
        { status: 500 },
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: uploadFormData,
      },
    );

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error("Pinata upload failed:", errorText);
      return NextResponse.json(
        { error: "Failed to upload to IPFS" },
        { status: 500 },
      );
    }

    const pinataData = await pinataResponse.json();
    const ipfsHash = pinataData.IpfsHash;
    const ipfsUrl = `https://${GATEWAY_URL}/ipfs/${ipfsHash}`;

    return NextResponse.json({
      success: true,
      ipfsUrl,
      ipfsHash,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
