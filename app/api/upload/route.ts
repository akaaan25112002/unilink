import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "No file provided" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Upload endpoint reachable",
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      uploadedBy: user.id,
    },
    { status: 200 }
  );
}
