import { getConfig } from "../../config";

export const getAccessToken = async (code: string, state: string) => {
  const { clientId, clientSecret, redirectUrl, oauthTokenUrl } = getConfig();
  const basicAuthSecret = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const headers = {
    Accept: "application/json",
    Authorization: `Basic ${basicAuthSecret}`,
  };

  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    state: state,
    redirect_url: redirectUrl,
  }).toString();

  const resp = await fetch(oauthTokenUrl, {
    method: "POST",
    headers: headers,
    body: data,
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(
      `Failed to get access token. Status: ${resp.status}, Response: ${errorText}`
    );

    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        `OAuth token error: ${
          errorJson.error_description || errorJson.error || errorText
        }`
      );
    } catch {
      throw new Error(`OAuth token error: ${errorText}`);
    }
  }

  const tokenData: { access_token?: string; error?: string } =
    await resp.json();
  if (!tokenData.access_token) {
    throw new Error(
      `Access token not found in response: ${
        tokenData.error || "Unknown error"
      }`
    );
  }
  return tokenData.access_token;
};
