import { User } from "../domain/entity/user";
import { UserOutput } from "../dto/output/types/user";

export const handleOauthLogin = async (identifier: string): Promise<User> => {
  // TODO: insert into db
  // identifier is student id
  return;
};
