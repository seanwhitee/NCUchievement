"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/lib/env";

export const SigninForm = () => {
  const router = useRouter();
  return (
    <Card className="py-10 w-full md:w-4/7 max-w-md h-full md:h-fit">
      <CardHeader className="flex flex-col items-center pb-10">
        <Image
          src={"/icon.png"}
          alt="app-icon"
          width={100}
          height={100}
          priority
          className="bg-none"
        ></Image>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={() => router.push(`${BACKEND_BASE_URL}/auth/login`)}
        >
          Sign in with Portal
        </Button>
      </CardContent>
    </Card>
  );
};
