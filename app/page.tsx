"use client";

import dynamic from "next/dynamic";
import { FloatingNav } from "../components/ui/FloatingNav";
import { navItems } from "@/data";
import Grid from "../components/Grid";
import RecentProjects from "../components/RecentProjects";
import Eperience from "../components/Experience";
import Footer from "../components/Footer";

const Hero = dynamic(() => import("../components/Hero"), { ssr: false });
const SafeWorld = dynamic(() => import("@/components/ui/Globe").then(mod => mod.World), {
  ssr: false,
});
const BugButton = dynamic(() => import("@/components/ui/BugButton"), { ssr: false });

export default function Home() {
  return (
    <main className="relative bg-[#00020f] flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <SafeWorld globeConfig={{ globeColor: "#0a0a0a" }} data={[]} />
        <Grid />
        <RecentProjects />
        <Eperience />
        <Footer />
        <BugButton />
      </div>
    </main>
  );
}
