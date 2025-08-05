const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

if (!PINATA_JWT || !GATEWAY_URL) {
  throw new Error("Pinata configuration missing");
}

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

  console.log("Uploading file to Pinata:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Pinata upload failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.IpfsHash) {
      throw new Error("No IPFS hash returned from Pinata");
    }

    const imageUrl = `https://${GATEWAY_URL}/ipfs/${data.IpfsHash}`;
    console.log("Pinata upload successful:", {
      hash: data.IpfsHash,
      url: imageUrl,
    });

    return imageUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
