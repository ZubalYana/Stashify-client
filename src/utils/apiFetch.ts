export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function tryParseJson(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/** Pulls a human-readable line out of `{ message }`, `{ error: { message } }`, or a JSON string of either. */
export function unwrapErrorMessage(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") {
    const nested = tryParseJson(data);
    if (nested) return unwrapErrorMessage(nested);
    return data;
  }
  if (typeof data !== "object") return "";

  const obj = data as Record<string, unknown>;

  if (typeof obj.message === "string" && obj.message) {
    const nested = tryParseJson(obj.message);
    if (nested) {
      const inner = unwrapErrorMessage(nested);
      if (inner) return inner;
    }
    return obj.message;
  }

  if (obj.error && typeof obj.error === "object") {
    const inner = unwrapErrorMessage(obj.error);
    if (inner) return inner;
  }

  return "";
}

export function messageForError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const text = unwrapErrorMessage(error.message);
    if (text) return text;
  }
  if (error instanceof Error && error.message) {
    const text = unwrapErrorMessage(error.message);
    if (text) return text;
  }
  return fallback;
}

export async function waitIfRateLimited(error: unknown, ms = 2000): Promise<void> {
  if (error instanceof ApiError && error.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: options.method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: options.body
    });

    if(!res.ok){
        if(res.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = '/auth';
            throw new ApiError('Unauthorized', 401);
        }
        let message = "";
        try {
          const data = await res.json();
          message = unwrapErrorMessage(data);
        } catch {
          // ignore
        }
        throw new ApiError(message, res.status);
    }

    return(res);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
