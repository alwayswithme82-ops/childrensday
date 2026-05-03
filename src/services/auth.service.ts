const SESSION_KEY = 'cube_auth_user';

interface StoredUser {
  uid: string;
  nickname: string;
}

function loadUser(): StoredUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export async function signInAnonymous(): Promise<string> {
  const existing = loadUser();
  if (existing?.uid) return existing.uid;
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function saveUser(uid: string, nickname: string): Promise<void> {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ uid, nickname }));
  } catch {}
}

export async function signOut(): Promise<void> {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getCurrentUser(): StoredUser | null {
  return loadUser();
}
