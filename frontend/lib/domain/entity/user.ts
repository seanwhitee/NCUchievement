export type User = {
  userId: string;
  roleId: number; // (0 = user, 1 = admin)
  username: string;
  name: string;
};
