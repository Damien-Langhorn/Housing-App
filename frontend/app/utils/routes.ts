import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ✅ Forward to backend API for secure upload
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'X-User-ID': user.id,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error('Backend upload failed');
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
