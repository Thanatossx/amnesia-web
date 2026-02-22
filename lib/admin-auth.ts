/**
 * Admin paneli şifre doğrulama.
 * Şifre .env.local içinde ADMIN_PASSWORD ile tanımlanabilir; yoksa varsayılan kullanılır.
 */

const DEFAULT_PASSWORD = "amnesiatonyc123";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
}

export function isCorrectPassword(input: string): boolean {
  return input === getAdminPassword();
}

/** Cookie için şifre hash'i (doğrulama için) */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getExpectedCookieValue(): Promise<string> {
  return hashPassword(getAdminPassword());
}
