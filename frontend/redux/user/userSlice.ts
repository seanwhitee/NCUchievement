import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "@/lib/domain/entity/user";

const initialUser: User = {
  userId: "",
  roleId: 0,
  username: "",
  name: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    update: (state, action: PayloadAction<User>) => {
      Object.assign(state, action.payload);
    },
  },
});
export const { update } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
