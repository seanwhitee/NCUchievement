"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DrawerItemProps {
  name: string;
  href: string;
}

export default function DrawerItem(props: DrawerItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === props.href || pathname.startsWith(props.href + "/");

  return (
    <Link href={props.href}>
      <Button
        variant={isActive ? "outline" : "ghost"}
        className="w-full border-none py-6"
      >
        <span className="w-full text-left">{props.name}</span>
      </Button>
    </Link>
  );
}
