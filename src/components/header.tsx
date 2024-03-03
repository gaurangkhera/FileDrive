import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Space_Grotesk } from "next/font/google";

const font = Space_Grotesk({ subsets: ["latin"] });

export function Header() {
  return (
    <div className="border-b py-4">
      <div className="items-center container mx-auto justify-between flex">
        <div className="text-lg font-bold">
          <Link href={"/"} className={font.className}>FileDrive.</Link>
        </div>
        <div className="flex gap-2">
        <Link href={'/pricing'} className={buttonVariants({
                variant: 'ghost'
            })}>Pricing</Link>
          <SignedIn>
            <Link href={'/dash/all'} className={buttonVariants({
                variant: 'ghost'
            })}>Dashboard</Link>
            <div className="bg-[#19191A] rounded-md p-0.5">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: {
                      padding: "0.2rem",
                    },
                  },
                }}
              />
            </div>
            <div className="mt-1">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
