"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AuthDialog } from "./AuthDialog";

export function Navbar() {
  const { data: session, status } = useSession();
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Pokédex
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session.user?.image ?? ""}
                  alt={session.user?.email ?? "User Avatar"}
                />
                <AvatarFallback>
                  {session.user?.email
                    ?.split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .toUpperCase() ?? <User />}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p>Signed in as</p>
                <p className="font-medium truncate">{session.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  router.push(`/trainer/${session.user?.trainer?._id ?? ""}`)
                }
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog open={openAuthDialog} onOpenChange={setOpenAuthDialog}>
            <DialogTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            {openAuthDialog && <AuthDialog />}
          </Dialog>
        )}
      </div>
    </nav>
  );
}
