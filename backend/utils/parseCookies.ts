export const parseCookies = (
  cookieHeader: string | undefined
): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length >= 2) {
        const name = decodeURIComponent(parts[0].trim());
        const value = decodeURIComponent(parts.slice(1).join("=")).trim();
        cookies[name] = value;
      }
    });
  }
  return cookies;
};
