"use client";
import React from "react";
import { StickyScroll } from "@/components/sticky-scroll";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/lamp";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const font = Space_Grotesk({ subsets: ["latin"] });

const content = [
  {
    title: "Real-time Updates",
    description:
      "Experience seamless collaboration with real-time updates. Our platform allows you to see changes as they happen, ensuring everyone on your team is always on the same page.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Real-time Updates
      </div>
    ),
  },
  {
    title: "Latest Technologies",
    description:
      "Stay ahead of the curve with our use of the latest technologies. We continually update our platform to ensure you have access to the most advanced tools and features.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Latest Technologies
      </div>
    ),
  },
  {
    title: "Familiar UI/UX",
    description:
      "Enjoy a user experience that feels familiar and intuitive. Our platform's interface is designed to resemble your operating system, making it easy to navigate and use.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Familiar UI/UX
      </div>
    ),
  },
];

export default function page() {
  return (
    <>
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className={cn("mt-8 bg-gradient-to-br from-foreground to-primary py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl", font.className)}
      >
        Store files <br /> the right way
      </motion.h1>
      <motion.div className="flex flex-row gap-2 mt-4">
        <SignedIn>
        <Link href='/dash/all' className={cn(buttonVariants(), 'gap-1.5')}>Dashboard <ArrowRight className="w-4 h-4" /></Link>
        </SignedIn>
        <SignedOut>
          <Button className="gap-1.5 cursor-pointer" asChild><SignInButton mode="modal"><div>Get Started <ArrowRight className="w-4 h-4" /></div></SignInButton></Button>
        </SignedOut>
        <Link href={'/pricing'} className={cn(buttonVariants({ 
          variant: 'outline'
        }), 'gap-1.5')}><DollarSign className="w-4 h-4" /> Pricing</Link>
      </motion.div>
    </LampContainer>
    <div className="p-10">
    <StickyScroll content={content} />
  </div></>
  );
}
