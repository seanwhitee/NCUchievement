import { getConfig } from "../../config";

export const getUser = async (accessToken: string) => {
  const settings = getConfig();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const resp = await fetch(settings.oauthUserInfoUrl, {
    method: "GET",
    headers: headers,
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(
      `Failed to get user info. Status: ${resp.status}, Response: ${errorText}`
    );
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        `OAuth user info error: ${
          errorJson.error_description || errorJson.error || errorText
        }`
      );
    } catch {
      throw new Error(`OAuth user info error: ${errorText}`);
    }
  }

  const userInfo: { identifier?: string } = await resp.json();
  return userInfo.identifier;
};
