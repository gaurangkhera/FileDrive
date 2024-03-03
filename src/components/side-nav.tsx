"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav({ className }: { className: any }) {
  const pathname = usePathname();

  return (
    <main className={className}>
        <div className="w-40 flex flex-col gap-4">
      <Link href="/dash/all">
        <Button className="gap-2.5 text-primary hover:text-primary"
          variant={pathname.includes("/dash/all") ? 'secondary' : 'ghost'}
        >
          <FileIcon /> All Files
        </Button>
      </Link>

      <Link href="/dash/fav">
        <Button className="gap-2.5 text-primary hover:text-primary"
          variant={pathname.includes("/dash/fav") ? 'secondary' : 'ghost'}
        >
          <StarIcon /> Favorites
        </Button>
      </Link>

      <Link href="/dash/trash">
        <Button className="gap-2.5 text-primary hover:text-primary"
          variant={pathname.includes("/dash/trash") ? 'secondary' : 'ghost'}
        >
          <Trash2Icon /> Trash
        </Button>
      </Link>
    </div>
    </main>
  );
}