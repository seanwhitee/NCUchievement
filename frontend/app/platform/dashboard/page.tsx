"use client";

import { redirect, RedirectType } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  useEffect(() => {
    redirect("/platform/dashboard/badges", RedirectType.replace);
  }, []);
  return <></>;
};

export default DashboardPage;
