export interface StoredUser {
  user_id: number;
  userEmail: string;
  userName: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

function parseUser(raw: string): StoredUser | null {
  try {
    const parsed = JSON.parse(raw) as Partial<StoredUser>;
    const user_id = Number(parsed.user_id);
    if (!Number.isFinite(user_id) || !parsed.userEmail || !parsed.userName) {
      return null;
    }
    return {
      user_id,
      userEmail: String(parsed.userEmail),
      userName: String(parsed.userName),
    };
  } catch {
    return null;
  }
}

function isUsableJwt(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return false;
  try {
    const padded =
      parts[1].replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((parts[1].length + 3) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function getStoredUser(): StoredUser | null {
  return getSession()?.user ?? null;
}

export function getSession(): { token: string; user: StoredUser } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  if (!isUsableJwt(token)) {
    clearSession();
    return null;
  }
  const user = parseUser(raw);
  if (!user) {
    clearSession();
    return null;
  }
  return { token, user };
}

export function setSession(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
