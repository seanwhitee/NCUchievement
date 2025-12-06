"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { oauthRepo } from "@/lib/domain/repository/oauth";

export const SigninForm = () => {
  return (
    <Card className="py-10 w-full md:w-4/7 max-w-md h-full md:h-fit">
      <CardHeader className="flex flex-col items-center pb-10">
        <Image
          src={"/icon.png"}
          alt="app-icon"
          width={60}
          height={60}
          priority
        ></Image>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={() => oauthRepo.login()}>
          Sign in with Portal
        </Button>
      </CardContent>
    </Card>
  );
};
