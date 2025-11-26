import { BACKEND_BASE_URL } from "@/lib/env";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { tryCatch } from "@/utils/tryCatch";
import { UserOutput } from "./types/user";
import { User } from "../entity/user";

const baseUrl = `${BACKEND_BASE_URL}/api/auth/me`;

export const oauthRepo = {
  login: async () => {
    const [, err] = await tryCatch(() => fetchWithAuth(`${baseUrl}/login`));
    if (err) throw err;
  },
  me: async (): Promise<User> => {
    // TODO: remove mock data after api integration
    // const [data, err] = await tryCatch<UserOutput>(() =>
    //   fetchWithAuth(`${baseUrl}/me`)
    // );
    // if (err) throw err;

    const mockAuthUser = {
      user_id: "mockId",
      role_id: 0, // (0 = user, 1 = admin)
      username: "mockUsername",
      name: "mockName",
    };

    return oauthRepo.mapToEntity(mockAuthUser);
  },
  mapToEntity: (data: UserOutput): User => {
    const { user_id, role_id, ...rest } = data;
    return {
      userId: user_id,
      roleId: role_id,
      ...rest,
    };
  },
};
