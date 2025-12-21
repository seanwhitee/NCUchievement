"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { selectUser } from "@/redux/user/userSlice";
import { List, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const PlatformPage = () => {
  const user = useAppSelector(selectUser);
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
        <p className="text-gray-900 dark:text-white text-3xl md:text-5xl font-black font-serif leading-tight tracking-[-0.033em]">
          Welcome back, {user.chineseName}
        </p>
        <br />
        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
          Ready to take on a new challenge today?
        </p>
        <br />
        <div className="flex gap-4">
          <Button
            className="px-8 py-3 font-semibold"
            variant="outline"
            onClick={() => router.push("/platform/collection")}
          >
            Explore badges
          </Button>
          <Button
            className="px-8 py-3 font-semibold"
            variant="outline"
            onClick={() => router.push("/platform/review")}
          >
            Review submissions
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlatformPage;
