import { NextResponse } from "next/server";

// Manual refresh proxy — validates the password server-side and only then
// forwards the request to the FastAPI backend. The backend's `/refresh`
// endpoint is never exposed to the browser directly, so the password and
// the backend URL stay isolated from client code paths beyond what
// `NEXT_PUBLIC_UST_API_URL` already implies.
export const runtime = "nodejs";

type Body = { password?: unknown };

function withApiPrefix(url: string): string {
  const base = url.replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

export async function POST(request: Request) {
  const expected = process.env.UST_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Refresh is not configured on the server." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password || password !== expected) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 },
    );
  }

  const apiBase = withApiPrefix(
    process.env.NEXT_PUBLIC_UST_API_URL || "http://localhost:8000",
  );

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase}/refresh`, {
      method: "POST",
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Backend unreachable";
    return NextResponse.json(
      { error: `Failed to reach backend: ${message}` },
      { status: 502 },
    );
  }

  const data: unknown = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(
      {
        error:
          (typeof data === "object" &&
            data !== null &&
            "error" in data &&
            String((data as { error?: unknown }).error)) ||
          `Backend HTTP ${upstream.status}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
