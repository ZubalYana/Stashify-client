import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

/** Drop the recording at `public/landing/demo.mp4` — this screen picks it up automatically. */
const DEMO_SRC = "/landing/demo.mp4";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Demo() {
  const shouldReduceMotion = useReducedMotion();
  const [hasVideo, setHasVideo] = useState(false);

  return (
    <section
      id="demo"
      className="relative z-10 flex min-h-svh flex-col justify-center
                 px-5 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 scroll-mt-6"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease }}
          className="text-center font-semibold text-white tracking-tight
                     text-[clamp(1.6rem,4vw,2.75rem)]"
        >
          See it in action
        </motion.h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="mt-3 max-w-xl text-center text-white/42
                     text-[13px] sm:text-[15px] leading-relaxed"
        >
          A quick walk through saving a snippet, letting AI label it, and finding
          it again when you need it.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.12, ease }}
          className="relative mt-6 w-full sm:mt-8"
        >
          <div
            className="pointer-events-none absolute -inset-8 rounded-[2rem]
                       bg-[#F07020]/10 blur-[70px] sm:-inset-12"
            aria-hidden="true"
          />

          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.08]
                       bg-[#141414] shadow-[0_28px_80px_-32px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate text-[11px] sm:text-[12px] text-white/28 tracking-wide">
                stashify.app — demo
              </span>
            </div>

            <div className="relative aspect-video bg-[#0d0d0d]">
              <video
                className={`absolute inset-0 h-full w-full object-cover
                            ${hasVideo ? "opacity-100" : "opacity-0"}`}
                src={DEMO_SRC}
                controls={hasVideo}
                playsInline
                preload="metadata"
                onLoadedData={() => setHasVideo(true)}
                onError={() => setHasVideo(false)}
              />

              {!hasVideo && (
                <div className="absolute inset-0 grid place-items-center overflow-hidden">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35]
                               bg-[linear-gradient(rgba(254,240,230,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(254,240,230,0.06)_1px,transparent_1px)]
                               bg-[size:28px_28px]"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2
                               bg-gradient-to-b from-[#F07020]/10 to-transparent"
                    aria-hidden="true"
                  />
                  {!shouldReduceMotion && (
                    <div
                      className="demo-scan pointer-events-none absolute inset-x-0 top-0 h-24
                                 bg-gradient-to-b from-transparent via-[#F07020]/18 to-transparent"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative z-[1] flex flex-col items-center px-6 text-center">
                    <span
                      className="grid size-14 sm:size-16 place-items-center rounded-full
                                 border border-[#F07020]/40 bg-[#F07020]/15 text-[#F07020]
                                 shadow-[0_0_0_6px_rgba(240,112,32,0.08)]"
                    >
                      <Play size={22} strokeWidth={2} fill="currentColor" className="ml-0.5" />
                    </span>
                    <p className="mt-4 text-white font-medium text-[14px] sm:text-[15px]">
                      Demo coming soon
                    </p>
                    <p className="mt-1 max-w-sm text-white/35 text-[12px] sm:text-[13px] leading-relaxed">
                      A short walkthrough will play here once it’s recorded.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
