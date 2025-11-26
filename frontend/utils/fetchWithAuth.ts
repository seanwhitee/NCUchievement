export const fetchWithAuth: typeof fetch = async (input, init) =>
  await fetch(input, { credentials: "include", ...init });
