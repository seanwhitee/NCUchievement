"use client";

import { useUserApi } from "@/hooks/api/useUserApi";
import { useAppDispatch } from "@/redux/hooks/useAppDispatch";
import { update as updateUser } from "@/redux/user/userSlice";
import React, { useEffect } from "react";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    query: { currentUser },
  } = useUserApi();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
    }
  }, [currentUser, dispatch]);
  return <div>{children}</div>;
};

export default PlatformLayout;
