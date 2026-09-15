import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const stages = [
  {
    title: "Paste your code",
    text: "Drop a snippet in as soon as you need it saved. No folders to set up first.",
  },
  {
    title: "Let AI label it",
    text: "Stashify names it, picks the language, and tags it so you don’t have to.",
  },
  {
    title: "Return for it anytime",
    text: "Find it later in a project, a collection, or a quick search — not in old comments.",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Flow() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="flow"
      className="relative z-10 flex min-h-svh flex-col justify-center
                 px-5 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 scroll-mt-6"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="min-w-0">
          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease }}
            className="font-semibold text-white tracking-tight
                       text-[clamp(1.6rem,4vw,2.75rem)] mb-8 sm:mb-10"
          >
            Straightforward flow
          </motion.h2>

          <ol className="flex flex-col">
            {stages.map((stage, index) => {
              const last = index === stages.length - 1;

              return (
                <motion.li
                  key={stage.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.5, delay: index * 0.14, ease }}
                  className="relative flex gap-4 sm:gap-5"
                >
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <span
                      className="grid size-8 place-items-center rounded-full
                                 border border-[#F07020]/45 bg-[#0a0a0a]
                                 text-[11px] font-semibold tracking-wider text-[#F07020]
                                 shadow-[0_0_0_4px_rgba(240,112,32,0.08)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!last && (
                      <div
                        className="mt-1.5 flex min-h-[2.75rem] sm:min-h-[4.5rem] flex-1 flex-col
                                   items-center text-[#F07020]/80"
                        aria-hidden="true"
                      >
                        <span className="w-px flex-1 bg-gradient-to-b from-[#F07020]/55 to-[#F07020]/18" />
                        <ArrowDown
                          size={16}
                          strokeWidth={2.25}
                          className="my-1 shrink-0"
                        />
                        <span className="w-px flex-1 bg-gradient-to-b from-[#F07020]/18 to-[#F07020]/40" />
                      </div>
                    )}
                  </div>

                  <article
                    className={`min-w-0 flex-1 rounded-2xl border border-white/[0.08]
                               bg-[#141414]/90 p-4 sm:p-5
                               shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)]
                               ${last ? "" : "mb-3 sm:mb-4"}`}
                  >
                    <h3 className="text-white font-semibold text-[16px] sm:text-[17px] leading-snug">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 text-white/42 text-[13px] sm:text-[14px] leading-relaxed">
                      {stage.text}
                    </p>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, x: 32 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="relative mx-auto flex w-full max-w-[28rem] items-center justify-center
                     lg:mx-0 lg:ml-auto lg:max-w-none"
        >
          <div
            className="pointer-events-none absolute size-[min(88%,26rem)] rounded-full
                       bg-[#F07020]/14 blur-[90px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute size-[min(72%,22rem)] rounded-full
                       border border-[#F07020]/18"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute size-[min(88%,26rem)] rounded-full
                       border border-white/[0.06]"
            aria-hidden="true"
          />
          <img
            src="/landing/step-1.svg"
            alt="Paste a snippet"
            className="relative z-[1] w-[min(78%,18rem)] sm:w-[min(86%,20rem)]
                       lg:w-[min(100%,26rem)] aspect-square object-contain
                       select-none pointer-events-none flow-float drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
