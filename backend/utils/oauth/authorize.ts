import { getAccessToken } from "./getAccessToken";
import { getUser } from "./getUser";

export const authorize = async (code: string, state: string) => {
  const accessToken = await getAccessToken(code, state);

  const identifier = await getUser(accessToken);

  return identifier;
};
