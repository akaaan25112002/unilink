import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  const response = NextResponse.redirect(new URL(next, request.url));

  if (!code) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value,
            ...(options as object),
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value: "",
            ...(options as object),
            maxAge: 0,
          });
        },
      },
    }
  );

  await supabase.auth.exchangeCodeForSession(code);

  return response;
}