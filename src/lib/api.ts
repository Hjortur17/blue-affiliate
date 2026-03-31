import type {
  DashboardSummary,
  EngagementData,
  LoginResponse,
  PayoutRecord,
  PayoutsData,
  RentalsData,
} from "@/types/api";

const API_BASE = "/api";

class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("affiliate_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/v1/affiliate${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message ?? `Request failed (${res.status})`;
    const code = body?.error?.code ?? "UNKNOWN";
    throw new ApiClientError(message, code, res.status);
  }

  return res.json() as Promise<T>;
}

async function requestData<T>(path: string, options: RequestInit = {}): Promise<T> {
  const envelope = await request<{ data: T }>(path, options);
  return envelope.data;
}

function dateRangeParams(month: number, year: number): string {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return `?from=${from}&to=${to}`;
}

export const api = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getDashboard(month: number, year: number): Promise<DashboardSummary> {
    return requestData<DashboardSummary>(`/dashboard/${dateRangeParams(month, year)}`);
  },

  getEngagement(month: number, year: number): Promise<EngagementData> {
    return requestData<EngagementData>(`/performance/engagement/${dateRangeParams(month, year)}`);
  },

  getRentals(month: number, year: number): Promise<RentalsData> {
    return requestData<RentalsData>(`/performance/rentals/${dateRangeParams(month, year)}`);
  },

  getPayouts(): Promise<PayoutsData> {
    return requestData<PayoutsData>("/payouts/");
  },

  requestPayout(amount: number): Promise<PayoutRecord> {
    return requestData<PayoutRecord>("/payouts/request", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
};

export { ApiClientError };
