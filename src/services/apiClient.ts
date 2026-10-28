import { API_URL } from "./config";
import { tokenStorage } from "./tokenStorage";
 
const REQUEST_TIMEOUT_MS = 20000;
 
export class ApiError extends Error {
  status: number;
  detail?: string;
  code?: string;
  fields: Record<string, string>;
  isNetworkError: boolean;
 
  constructor(init: {
    status: number;
    message: string;
    detail?: string;
    code?: string;
    fields?: Record<string, string>;
    isNetworkError?: boolean;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.detail = init.detail;
    this.code = init.code;
    this.fields = init.fields ?? {};
    this.isNetworkError = init.isNetworkError ?? false;
  }
}
 
type Query = Record<string, string | number | boolean | null | undefined>;
 
export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: Record<string, unknown> | FormData | null;
  params?: Query;
  auth?: boolean;
};
 
let sessionExpiredHandler: (() => void) | null = null;
 
export function setSessionExpiredHandler(handler: (() => void) | null) {
  sessionExpiredHandler = handler;
}
 
function buildUrl(path: string, params?: Query): string {
  let url: string;
 
  if (/^https?:\/\//i.test(path)) {
    url = path;
  } else {
    url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  }
 
  if (params) {
    const parts: string[] = [];
 
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
 
    if (parts.length > 0) {
      url += (url.includes("?") ? "&" : "?") + parts.join("&");
    }
  }
 
  return url;
}
 
async function readBody(response: Response): Promise<any> {
  let text = "";
 
  try {
    text = await response.text();
  } catch {
    return null;
  }
 
  if (text.trim() === "") return null;
 
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
 
function fallbackMessage(status: number): string {
  if (status === 401) return "Please sign in again.";
  if (status === 403) return "You are not allowed to do this.";
  if (status === 404) return "We could not find what you asked for.";
  if (status === 429)
    return "Too many requests. Please wait a moment and try again.";
  if (status === 503) return "We could not send the email. Please try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again.";
  return "Something went wrong. Please try again.";
}
 
function toApiError(status: number, body: any): ApiError {
  const fields: Record<string, string> = {};
  let detail: string | undefined;
  let code: string | undefined;
 
  if (body && typeof body === "object" && !Array.isArray(body)) {
    if (typeof body.detail === "string") detail = body.detail;
    if (typeof body.code === "string") code = body.code;
 
    for (const [key, value] of Object.entries(body)) {
      if (key === "detail" || key === "code") continue;
 
      if (Array.isArray(value) && value.length > 0) {
        fields[key] = String(value[0]);
      } else if (typeof value === "string") {
        fields[key] = value;
      }
    }
  }
 
  const firstField = Object.values(fields)[0];
  const message = detail ?? firstField ?? fallbackMessage(status);
 
  return new ApiError({ status, message, detail, code, fields });
}
 
async function send<T>(
  path: string,
  options: RequestOptions,
  token: string | null,
): Promise<T> {
  const { method = "GET", body = null, params } = options;
 
  const headers: Record<string, string> = { Accept: "application/json" };
 
  if (token) headers.Authorization = `Bearer ${token}`;
 
  let payload: any = undefined;
 
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== null) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
 
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
 
  let response: Response;
 
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = (error as Error)?.name === "AbortError";
 
    throw new ApiError({
      status: 0,
      isNetworkError: true,
      message: timedOut
        ? "The request took too long. Check your connection and try again."
        : "Check your internet connection and try again.",
    });
  } finally {
    clearTimeout(timer);
  }
 
  const data = await readBody(response);
 
  if (!response.ok) {
    throw toApiError(response.status, data);
  }
 
  return (data ?? undefined) as T;
}
 
async function endSession() {
  await tokenStorage.clear();
  sessionExpiredHandler?.();
}
 
async function doRefresh(): Promise<string> {
  const refresh = await tokenStorage.getRefresh();
 
  if (!refresh) {
    await endSession();
 
    throw new ApiError({
      status: 401,
      code: "token_not_valid",
      message: "Your session has expired. Please sign in again.",
    });
  }
 
  try {
    const data = await send<{ access: string; refresh: string }>(
      "/api/auth/refresh",
      { method: "POST", body: { refresh } },
      null,
    );
 
    await tokenStorage.save(data.access, data.refresh);
 
    return data.access;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await endSession();
    }
 
    throw error;
  }
}
 
let refreshInFlight: Promise<string> | null = null;
 
function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
 
  return refreshInFlight;
}
 
export async function request<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const useAuth = options.auth !== false;
  const token = useAuth ? await tokenStorage.getAccess() : null;
 
  try {
    return await send<T>(path, options, token);
  } catch (error) {
    const expired =
      error instanceof ApiError && error.status === 401 && useAuth && !!token;
 
    if (!expired) throw error;
 
    const freshToken = await refreshAccessToken();
 
    return send<T>(path, options, freshToken);
  }
}
 
export const api = {
  get: <T = any>(path: string, params?: Query, auth = true) =>
    request<T>(path, { method: "GET", params, auth }),
 
  post: <T = any>(path: string, body?: RequestOptions["body"], auth = true) =>
    request<T>(path, { method: "POST", body, auth }),
 
  patch: <T = any>(path: string, body?: RequestOptions["body"], auth = true) =>
    request<T>(path, { method: "PATCH", body, auth }),
 
  delete: <T = any>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
};