import type {
  CurveResponse,
  DatesResponse,
  LatestDateResponse,
  NewsResponse,
  RefreshResponse,
  SimilarResponse,
} from "./types";

function withApiPrefix(url: string): string {
  const base = url.replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const BASE = withApiPrefix(
  process.env.NEXT_PUBLIC_UST_API_URL || "http://localhost:8000",
);

async function getJSON<T>(path: string): Promise<T> {
  const resp = await fetch(`${BASE}${path}`);
  if (!resp.ok) {
    throw new Error(`${path} -> HTTP ${resp.status}`);
  }
  return (await resp.json()) as T;
}

export function fetchLatestDate(): Promise<LatestDateResponse> {
  return getJSON<LatestDateResponse>("/latest-date");
}

export function fetchDates(): Promise<DatesResponse> {
  return getJSON<DatesResponse>("/dates");
}

export function fetchCurve(date: string): Promise<CurveResponse> {
  return getJSON<CurveResponse>(`/curve?date=${encodeURIComponent(date)}`);
}

export function fetchSimilar(
  date: string,
  n = 10,
): Promise<SimilarResponse> {
  const params = new URLSearchParams({ date, n: String(n) });
  return getJSON<SimilarResponse>(`/similar?${params}`);
}

export function fetchNews(
  date: string,
  lookback: string,
): Promise<NewsResponse> {
  const params = new URLSearchParams({ date, lookback });
  return getJSON<NewsResponse>(`/news?${params}`);
}

// Manual refresh is gated behind the site's password-protected proxy route
// (`/api/ust-refresh`) — do NOT call the FastAPI backend's `/refresh`
// endpoint directly from the browser.
export async function postRefreshWithPassword(
  password: string,
): Promise<RefreshResponse> {
  const resp = await fetch("/api/ust-refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data: unknown = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const errMsg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error?: unknown }).error ?? "")
        : "";
    if (resp.status === 401) {
      throw new Error(errMsg || "Incorrect password");
    }
    throw new Error(errMsg || `refresh -> HTTP ${resp.status}`);
  }
  return data as RefreshResponse;
}
