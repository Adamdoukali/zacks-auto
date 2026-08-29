/**
 * Zack's Auto High-Security Cryptographic Authentication Service
 * Uses Web Crypto API (SHA-256 + Salt) with timing-attack mitigation and brute-force lockout
 */

const SALT = "zacks_auto_secure_salt_2026_m0r0cc0";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Default authorized credentials hash (SHA-256 salted)
// Email: admin@zacksauto.ma
// Initial default password hash
const DEFAULT_EMAIL_HASH = "8e9b8979bbcb2737f9efbe4d8520cf9723cf7aa33f48aa55883ef4b1ef40ae4e"; // admin@zacksauto.ma
const DEFAULT_PASS_HASH = "294a50d249f076b92a35626b1c4b786fa0d1e57c6b4d31481a5a07c312739343";  // Zack@Auto2026!

/**
 * Computes a salted SHA-256 hex string using native Web Crypto
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

interface LockoutState {
  attempts: number;
  lockedUntil: number | null;
}

function getLockoutState(): LockoutState {
  if (typeof window === "undefined") return { attempts: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem("zaks_auth_lockout");
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function setLockoutState(state: LockoutState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("zaks_auth_lockout", JSON.stringify(state));
}

/**
 * Validates admin credentials securely
 */
export async function verifyAdminCredentials(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string }> {
  const state = getLockoutState();
  const now = Date.now();

  // Check lockout
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingMinutes = Math.ceil((state.lockedUntil - now) / (60 * 1000));
    return {
      success: false,
      error: `Security Lockout Active. Please wait ${remainingMinutes} minute(s) before trying again.`,
    };
  }

  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  const inputEmailHash = await hashString(cleanEmail);
  const inputPassHash = await hashString(cleanPass);

  const storedEmailHash =
    typeof window !== "undefined" && localStorage.getItem("zaks_adm_eh")
      ? localStorage.getItem("zaks_adm_eh")!
      : DEFAULT_EMAIL_HASH;

  const storedPassHash =
    typeof window !== "undefined" && localStorage.getItem("zaks_adm_ph")
      ? localStorage.getItem("zaks_adm_ph")!
      : DEFAULT_PASS_HASH;

  const isEmailMatch = timingSafeEqual(inputEmailHash, storedEmailHash);
  const isPassMatch = timingSafeEqual(inputPassHash, storedPassHash);

  if (isEmailMatch && isPassMatch) {
    // Reset attempts on successful auth
    setLockoutState({ attempts: 0, lockedUntil: null });

    // Generate signed session token with expiry
    const sessionPayload = {
      user: cleanEmail,
      timestamp: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
      signature: await hashString(cleanEmail + now + SALT),
    };

    sessionStorage.setItem("zaks_admin_session", JSON.stringify(sessionPayload));
    return { success: true };
  }

  // Handle failed attempt
  const newAttempts = (state.attempts || 0) + 1;
  if (newAttempts >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_DURATION_MS;
    setLockoutState({ attempts: newAttempts, lockedUntil });
    return {
      success: false,
      error: `Maximum login attempts exceeded. Account locked for 15 minutes.`,
    };
  }

  setLockoutState({ attempts: newAttempts, lockedUntil: null });
  const remaining = MAX_ATTEMPTS - newAttempts;
  return {
    success: false,
    error: `Authentication failed. Invalid credentials (${remaining} attempt(s) remaining).`,
  };
}

/**
 * Checks if current session is active and valid
 */
export async function isSessionValid(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem("zaks_admin_session");
    if (!raw) return false;
    const session = JSON.parse(raw);
    const now = Date.now();

    if (!session.expiresAt || now > session.expiresAt) {
      sessionStorage.removeItem("zaks_admin_session");
      return false;
    }

    const expectedSig = await hashString(session.user + session.timestamp + SALT);
    return timingSafeEqual(session.signature, expectedSig);
  } catch {
    return false;
  }
}

/**
 * Terminates admin session
 */
export function terminateSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("zaks_admin_session");
}

/**
 * Updates admin master credentials securely
 */
export async function updateAdminCredentials(
  newEmail: string,
  newPassword: string
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const emailHash = await hashString(newEmail.trim().toLowerCase());
  const passHash = await hashString(newPassword.trim());

  localStorage.setItem("zaks_adm_eh", emailHash);
  localStorage.setItem("zaks_adm_ph", passHash);
  return true;
}
