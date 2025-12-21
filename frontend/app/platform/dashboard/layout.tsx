"use client";

import NavigationDrawer from "@/components/NavigationDrawer";
import { DrawerItemProps } from "@/components/DrawerItem";
import { useEffect, useState } from "react";

import FunctionPanel from "@/components/FuntionPanel";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { selectUser } from "@/redux/user/userSlice";

const BASE_DASHBOARD_PATH = "/platform/dashboard";
const DASHBOARD_LINKS: DrawerItemProps[] = [
  { name: "Badges", href: `${BASE_DASHBOARD_PATH}/badges` },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  useEffect(() => {
    router.push(`${BASE_DASHBOARD_PATH}/badges`);
  }, [router]);

  const [isOpen, setOpen] = useState(true);
  const currentUser = useAppSelector(selectUser);
  if (currentUser.roleId !== 1) return <div>Not authorized</div>;

  return (
    <div className="px-4 md:px-8">
      <FunctionPanel onToggle={() => setOpen(!isOpen)} />
      {isOpen && (
        <NavigationDrawer
          links={DASHBOARD_LINKS}
          heading="Dashboard"
          onToggle={() => setOpen(!isOpen)}
        />
      )}
      <div
        className={cn("z-0 w-full pt-20 transition-all duration-300", {
          "lg:pl-64": isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
}
