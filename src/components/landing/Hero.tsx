import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../../utils/session";
import SnippetCarousel from "./SnippetCarousel";

export default function Hero() {
  const navigate = useNavigate();
  const loggedIn = Boolean(getSession());

  return (
    <section className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-col items-center px-5 sm:px-8 text-center pt-3 pb-4 sm:pt-4 sm:pb-5">
        <h1 className="font-bold text-white uppercase tracking-[-0.04em] leading-[0.95]
                       text-[clamp(1.85rem,5.6vw,3.75rem)]">
          Stash it away
        </h1>

        <h2 className="mt-2 sm:mt-2.5 text-white/80 font-medium leading-snug
                       text-[clamp(0.92rem,1.5vw,1.2rem)]">
          And actually return for it when the time comes.
        </h2>

        <p className="mt-2 text-white/40 leading-relaxed
                      text-[clamp(0.78rem,1.05vw,0.9rem)] max-w-[50rem]">
          Ever needed to save a code snippet for later, only to spend ages
          rummaging through notes and comments trying to find it? Stashify
          solves that: a tool for developers to save, group, and label reusable
          code snippets.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(loggedIn ? "/snippets" : "/auth")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F07020]
                       px-4 py-2 text-[13px] sm:text-[14px]
                       font-semibold text-white cursor-pointer
                       hover:bg-[#FF8533] hover:shadow-[0_0_0_6px_rgba(240,112,32,0.15)]
                       active:scale-[0.97] transition-all duration-200"
          >
            {loggedIn ? "Open app" : "Sign up"}
            <ArrowRight size={14} strokeWidth={2.25} />
          </button>

          <a
            href="#features"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="inline-flex items-center rounded-full border border-white/16
                       px-4 py-2 text-[13px] sm:text-[14px]
                       font-medium text-white/80
                       hover:border-white/28 hover:bg-white/[0.04] hover:text-white
                       active:scale-[0.97] transition-all duration-200"
          >
            Read more
          </a>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end pb-4 sm:pb-5">
        <SnippetCarousel />
      </div>
    </section>
  );
}
