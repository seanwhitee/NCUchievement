import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Badge } from "@/lib/domain/entity/badge";

interface BadgeState {
  badges: Badge[];
}
const initialBadge: BadgeState = {
  badges: [],
};

export const badgeSlice = createSlice({
  name: "badge",
  initialState: initialBadge,
  reducers: {
    update: (state, action: PayloadAction<Badge[]>) => {
      state.badges = action.payload;
    },
  },
});

export const { update } = badgeSlice.actions;
export const selectBadges = (state: RootState) => state.badge.badges;
export default badgeSlice.reducer;
