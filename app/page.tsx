import Image from "next/image";
import Hero from "../components/Hero";
import { FloatingNav } from "../components/ui/FloatingNav";
import { FaHome } from "react-icons/fa";
import Grid from "../components/Grid";
import RecentProjects from "../components/RecentProjects";
import { navItems } from "@/data";
import Eperience from "../components/Experience";
import Footer from "../components/Footer";
import BugButton from "@/components/ui/BugButton";




export default function Home() {
  return (
 <main className="relative  bg-[#00020f] flex justify-center items-center flex-col  mx-auto sm:px-10 px-5 overflow-clip  ">
  <div className=" max-w-7xl w-full ">
    <FloatingNav navItems={navItems}/>
    <Hero />
    <Grid/>
    <RecentProjects/>
    <Eperience/>
    <Footer/>
    <BugButton/>
  </div>
 </main>
  );
}
