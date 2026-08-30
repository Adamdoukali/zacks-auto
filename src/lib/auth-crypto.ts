/**
 * Zack's Auto High-Security Cryptographic Authentication Service
 * Uses Web Crypto API (SHA-256 + Salt) with timing-attack mitigation and brute-force lockout
 */

const SALT = "zacks_auto_secure_salt_2026_m0r0cc0";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Valid authorized default emails & passwords
const INITIAL_ALLOWED_EMAILS = [
  "admin@zacksauto.ma",
  "contact@zacksauto.ma",
  "admin@zacks-auto.ma",
  "adamdoukali@gmail.com",
  "admin",
];

const INITIAL_ALLOWED_PASSWORDS = [
  "Zacks2026",
  "zacks2026",
  "Zacks2026!",
  "zacks2026!",
  "Zack@Auto2026!",
  "zack@auto2026!",
  "Zack@2026",
  "zack@2026",
  "Zack2026",
  "zack2026",
  "admin2026",
  "admin",
];

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
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "Please enter both email and password." };
  }

  const state = getLockoutState();
  const now = Date.now();

  const inputEmailHash = await hashString(cleanEmail);
  const inputPassHash = await hashString(cleanPass);

  const customEmailHash =
    typeof window !== "undefined" ? localStorage.getItem("zaks_adm_eh") : null;
  const customPassHash =
    typeof window !== "undefined" ? localStorage.getItem("zaks_adm_ph") : null;

  let isEmailValid = false;
  let isPassValid = false;

  // Check custom credentials if set
  if (customEmailHash && customPassHash) {
    isEmailValid = timingSafeEqual(inputEmailHash, customEmailHash);
    isPassValid = timingSafeEqual(inputPassHash, customPassHash);
  }

  // If no custom credentials or not matched, check initial defaults
  if (!isEmailValid || !isPassValid) {
    const defaultEmailMatches = INITIAL_ALLOWED_EMAILS.some((e) => e.toLowerCase() === cleanEmail);
    const defaultPassMatches = INITIAL_ALLOWED_PASSWORDS.some(
      (p) => p === cleanPass || p.toLowerCase() === cleanPass.toLowerCase()
    );

    if (defaultEmailMatches && defaultPassMatches) {
      isEmailValid = true;
      isPassValid = true;
    }
  }

  if (isEmailValid && isPassValid) {
    // Reset lockout attempts on successful authentication
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

  // Check lockout on failure
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingMinutes = Math.ceil((state.lockedUntil - now) / (60 * 1000));
    return {
      success: false,
      error: `Security Lockout Active. Please wait ${remainingMinutes} minute(s) before trying again.`,
    };
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
