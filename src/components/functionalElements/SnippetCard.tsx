import { motion, useReducedMotion } from "framer-motion";
import { Copy, Pencil, Trash2, Check } from "lucide-react";
import { useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export interface SnippetCardProps {
  title: string;
  description: string;
  code: string;
  language: string;
  tags?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onCardClick?: () => void;
}

function previewLines(code: string, max = 8): string {
  return code.split("\n").slice(0, max).join("\n");
}

interface ActionButtonProps {
  onClick?: () => void;
  shouldReduceMotion: boolean | null;
  children: React.ReactNode;
  label: string;
  danger?: boolean;
}

function ActionButton({ onClick, shouldReduceMotion, children, label, danger }: ActionButtonProps) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      className={`p-[6px] rounded-[8px] transition-colors duration-150 cursor-pointer
        ${danger
          ? "text-[#B7ADA6]/50 hover:text-red-400 hover:bg-red-400/10"
          : "text-[#B7ADA6]/50 hover:text-white hover:bg-white/[0.06]"
        }`}
      whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
    >
      {children}
    </motion.button>
  );
}

export default function SnippetCard({
  title,
  description,
  code,
  language,
  tags = [],
  onEdit,
  onDelete,
  onCardClick
}: SnippetCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const highlightedCode = hljs.highlight(code, {
    language: language,
  }).value;

  return (
    <motion.div
      className="group relative w-full rounded-[16px] overflow-hidden
                 bg-[#1C1C1C] border border-white/[0.06]
                 flex flex-col cursor-pointer"
      whileHover={shouldReduceMotion ? {} : { y: -2, borderColor: "rgba(240,112,32,0.18)" }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={onCardClick}
    >
      {/* Code preview area — fixed height so all cards are equal */}
      <div
        className="relative bg-[#141414] overflow-hidden flex-shrink-0"
        style={{ height: "160px" }}
      >
        {/* Action buttons — z-20 so they sit above the code, bg so code doesn't bleed through */}
        <div
          className="absolute top-3 right-3 flex items-center gap-x-1 z-20
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      bg-[#141414]/80 backdrop-blur-sm rounded-[10px] p-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionButton label="Copy code" shouldReduceMotion={shouldReduceMotion} onClick={()=>handleCopy}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {copied
                ? <Check size={14} strokeWidth={2} className="text-[#F07020]" />
                : <Copy size={14} strokeWidth={1.5} />
              }
            </motion.span>
          </ActionButton>
          <ActionButton label="Edit snippet" shouldReduceMotion={shouldReduceMotion} onClick={onEdit}>
            <Pencil size={14} strokeWidth={1.5} />
          </ActionButton>
          <ActionButton label="Delete snippet" shouldReduceMotion={shouldReduceMotion} onClick={onDelete} danger>
            <Trash2 size={14} strokeWidth={1.5} />
          </ActionButton>
        </div>

        <pre
          className="text-[11.5px] leading-[1.75] font-mono text-[#B7ADA6]/80
                     whitespace-pre overflow-hidden select-none px-4 pt-4"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: previewLines(highlightedCode) }}
        />

        {/* Fade out gradient at the bottom of the code area */}
        <div
          className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #141414)" }}
        />
      </div>

      {/* Card body — fixed min-height so cards with no tags still match cards with tags */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-y-[6px] flex-1">
        <h3 className="text-[16px] font-semibold text-[#F07020] leading-snug truncate">
          {title}
        </h3>
        <p className="text-[12px] text-[#B7ADA6]/70 leading-relaxed line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[6px] mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-[#F07020]/80
                           px-2 py-[3px] rounded-[6px]
                           bg-[#F07020]/[0.08] border border-[#F07020]/[0.12]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}