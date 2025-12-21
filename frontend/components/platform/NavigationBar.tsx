"use client";

import Image from "next/image";
import { oauthRepo } from "@/lib/domain/repository/oauth";
import Link from "next/link";
import logo from "./logo.png";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/lib/env";

export const NavigationBar = () => {
  const router = useRouter();
  const navItems = [
    {
      name: "Home",
      href: "/platform",
    },
    {
      name: "Collections",
      href: "/platform/collection",
    },
    {
      name: "Review",
      href: "/platform/review",
    },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0  ">
            <Link
              key="home"
              href="/platform"
              className="flex items-center gap-2"
            >
              <Image
                src={logo}
                alt="app-icon"
                width={60}
                height={60}
                priority
              ></Image>
              <h1 className="text-xl font-serif font-bold text-foreground">
                NCUchievement
              </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm
          font-medium text-muted-foreground hover:text-foreground
          transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <Button
              className="hidden sm:inline-flex"
              onClick={() => router.push(`${BACKEND_BASE_URL}/auth/logout`)}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
