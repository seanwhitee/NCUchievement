import jwt from "jsonwebtoken";

export interface TokenData {
  id: number;
  role_id: number; // 0=user, 1=admin
  chinese_name: string;
  student_id: string;
  exp: number;
}

/**
 * Extract the auth_token from the Cookie header.
 */
export function getTokenFromCookies(cookies: string): string | null {
  if (!cookies) return null;

  const cookieArray = cookies.split(";");
  for (const cookie of cookieArray) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith("auth_token=")) {
      return trimmed.split("=")[1];
    }
  }
  return null;
}

/**
 * Decode a JWT token and return the payload as a TokenData object.
 */
export function decodeToken(token: string, secretKey: string, algorithms: string[]): TokenData {
  try {
    const payload = jwt.verify(token, secretKey, { algorithms }) as any;
    return {
      id: payload.id,
      role_id: payload.role_id,
      chinese_name: payload.chinese_name,
      student_id: payload.student_id,
      exp: payload.exp,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
}
