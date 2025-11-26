"use client";

import { HeroTitle } from "@/components/landing-page/HeroTitle";
import { Button } from "@/components/ui/aceternity/button";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10">
      <HeroTitle />
      <Button
        onClick={() => router.push("/sign-in")}
        text="Get started"
      ></Button>
    </div>
  );
}
