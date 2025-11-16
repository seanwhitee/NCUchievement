import { SignJWT } from "jose";
import { User } from "../../domain/entity/user";
import { getConfig } from "../../config";

export const issue = async (user: User) => {
  const { secretKey } = getConfig();
  const secret = new TextEncoder().encode(secretKey);

  const payload = {
    userId: user.id,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Token expires in 2 hours
    .sign(secret);

  return jwt;
};
