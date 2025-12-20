import { BACKEND_BASE_URL } from "@/lib/env";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { tryCatch } from "@/utils/tryCatch";
import { UserOutput } from "./types/user";
import { User } from "../entity/user";

const baseUrl = `${BACKEND_BASE_URL}/auth`;

export const oauthRepo = {
  me: async (): Promise<User> => {
    const [data, err] = await tryCatch<UserOutput>(() =>
      fetchWithAuth(`${baseUrl}/me`)
    );
    if (err) throw err;

    return oauthRepo.mapToEntity(data!);
  },
  mapToEntity: (data: UserOutput): User => {
    const { chinese_name, role_id, ...rest } = data;
    return {
      chineseName: chinese_name,
      roleId: role_id,
      ...rest,
    };
  },
};
