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
        {/* --- Feature Description Section --- */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 px-4">
          {[
            {
              icon: <List className="w-8 h-8 text-blue-500" />,
              title: "Explore Campus",
              desc: "From the pine cones on the lawn to the late-night snacks at the back door. Discover hidden tasks around NCU.",
            },
            {
              icon: <Trophy className="w-8 h-8 text-yellow-500" />,
              title: "Earn Badges",
              desc: "Turn your routines into achievements. Collect unique badges to showcase your campus survival skills.",
            },
            {
              icon: <Users className="w-8 h-8 text-purple-500" />,
              title: "Community Driven",
              desc: "A peer-to-peer verification system. Help validate other students' achievements and keep the fairness.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-left hover:bg-white dark:hover:bg-gray-800 transition duration-300"
            >
              <div className="mb-4 bg-gray-100 dark:bg-gray-700/50 w-14 h-14 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default PlatformPage;
