import AnimatedBackground from "../AnimatedBackground";
import Demo from "../landing/Demo";
import Flow from "../landing/Flow";
import Hero from "../landing/Hero";
import LandingFooter from "../landing/LandingFooter";
import LandingHeader from "../landing/LandingHeader";

export default function Landing() {
  return (
    <div className="relative w-full h-svh overflow-y-auto scroll-smooth bg-[#0a0a0a] text-[#FEF0E6]">
      <AnimatedBackground />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#F07020]/5 blur-[100px] pointer-events-none top-[-120px] left-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex h-svh flex-col overflow-hidden">
        <LandingHeader />
        <Hero />
      </div>
      <Flow />
      <Demo />
      <LandingFooter />
    </div>
  );
}
