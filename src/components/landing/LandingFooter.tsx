import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WordMarkLogo from "../WordmarkLogo";
import { getSession } from "../../utils/session";

const ease = [0.22, 1, 0.36, 1] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function LandingFooter() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const loggedIn = Boolean(getSession());

  return (
    <motion.footer
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease }}
      className="relative z-10 border-t border-white/[0.07]
                 px-5 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row
                      sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <WordMarkLogo size="xs" />
          <p className="max-w-xs text-white/32 text-[12px] sm:text-[13px] leading-relaxed">
            Save it once. Find it when it matters.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <button
            type="button"
            onClick={() => scrollToId("flow")}
            className="text-white/45 hover:text-[#F07020] transition-colors duration-200
                       cursor-pointer"
          >
            Flow
          </button>
          <button
            type="button"
            onClick={() => scrollToId("demo")}
            className="text-white/45 hover:text-[#F07020] transition-colors duration-200
                       cursor-pointer"
          >
            Demo
          </button>
          <button
            type="button"
            onClick={() => navigate(loggedIn ? "/snippets" : "/auth")}
            className="text-white/45 hover:text-[#F07020] transition-colors duration-200
                       cursor-pointer"
          >
            {loggedIn ? "Open app" : "Sign up"}
          </button>
        </nav>
      </div>

      <p className="mx-auto mt-6 max-w-6xl text-white/22 text-[11px] sm:text-[12px]">
        © {new Date().getFullYear()} Stashify
      </p>
    </motion.footer>
  );
}
