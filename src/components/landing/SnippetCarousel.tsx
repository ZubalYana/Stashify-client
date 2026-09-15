import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { heroSlides, type HeroSlide } from "./heroSlides";

const COPIES = 3;
const GLOW = [
  "30%_20%",
  "70%_15%",
  "40%_80%",
  "80%_60%",
  "20%_50%",
] as const;

interface SnippetCarouselProps {
  slides?: HeroSlide[];
}

function SlideCard({ slide, index }: { slide: HeroSlide; index: number }) {
  const [ready, setReady] = useState(false);
  const glow = GLOW[index % GLOW.length];

  return (
    <article
      data-carousel-card
      className="relative shrink-0 aspect-[16/10] h-auto
                 w-[min(82vw,calc((100vw-1.25rem)/1.25),calc(34svh*1.6))]
                 md:w-[min(calc((100vw-2.5rem)/2.45),calc(38svh*1.6))]
                 lg:w-[min(calc((100vw-3.5rem)/3.15),calc(42svh*1.6))]
                 rounded-[18px] sm:rounded-[20px] overflow-hidden
                 bg-[#1c1c1c] border border-white/[0.08]
                 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]
                 origin-center will-change-transform"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${glow.replace("_", " ")}, rgba(240,112,32,0.08), transparent 45%), linear-gradient(180deg, #1a1a1a, #101010)`,
        }}
        aria-hidden="true"
      />
      <img
        src={slide.src}
        alt={slide.alt}
        draggable={false}
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
        className={`relative h-full w-full object-cover object-top select-none pointer-events-none transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </article>
  );
}

export default function SnippetCarousel({ slides = heroSlides }: SnippetCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
  } | null>(null);

  const loopWidth = useCallback(() => groupRef.current?.offsetWidth ?? 0, []);

  const centerLoop = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = loopWidth();
  }, [loopWidth]);

  const wrapLoop = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = loopWidth();
    if (width === 0) return;

    if (el.scrollLeft < width * 0.5) {
      el.scrollLeft += width;
    } else if (el.scrollLeft >= width * 1.5) {
      el.scrollLeft -= width;
    }
  }, [loopWidth]);

  const updateEdgeScale = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const bounds = el.getBoundingClientRect();
    const mid = bounds.left + bounds.width / 2;
    const reach = bounds.width / 2;

    el.querySelectorAll<HTMLElement>("[data-carousel-card]").forEach((card) => {
      const cardBounds = card.getBoundingClientRect();
      const cardMid = cardBounds.left + cardBounds.width / 2;
      const t = Math.min(1, Math.abs(cardMid - mid) / reach);
      card.style.transform = `scale(${1 - t * 0.07})`;
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    centerLoop();
    updateEdgeScale();

    const onScroll = () => {
      wrapLoop();
      updateEdgeScale();
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    const resize = new ResizeObserver(() => {
      centerLoop();
      updateEdgeScale();
    });
    resize.observe(el);
    if (groupRef.current) resize.observe(groupRef.current);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      resize.disconnect();
    };
  }, [centerLoop, updateEdgeScale, wrapLoop]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    el.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      el.scrollBy({ left: 280, behavior: "smooth" });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      el.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Product screenshots"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="hero-carousel flex items-end overflow-x-auto overscroll-x-contain
                   cursor-grab active:cursor-grabbing select-none outline-none
                   touch-pan-x"
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? groupRef : undefined}
            aria-hidden={copy !== 1}
            className="flex items-end gap-3 sm:gap-4 lg:gap-5 pr-3 sm:pr-4 lg:pr-5"
          >
            {slides.map((slide, index) => (
              <SlideCard key={`${copy}-${slide.src}`} slide={slide} index={index} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
