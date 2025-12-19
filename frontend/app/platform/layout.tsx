"use client";

import { NavigationBar } from "@/components/platform/NavigationBar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { useBadgeApi } from "@/hooks/api/useBadgeApi";
import { useUserApi } from "@/hooks/api/useUserApi";
import { useAppDispatch } from "@/redux/hooks/useAppDispatch";
import { update as updateUser } from "@/redux/user/userSlice";
import { update as updataBadges } from "@/redux/badge/badgeSlice";
import React, { useEffect } from "react";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    query: { currentUser },
  } = useUserApi();

  const {
    query: { badges },
  } = useBadgeApi();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (badges) {
      dispatch(updataBadges(badges));
    }
  }, [badges, dispatch]);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NavigationBar />
        {children}
      </ThemeProvider>
    </>
  );
};

export default PlatformLayout;
