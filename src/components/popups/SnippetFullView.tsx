import { motion } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import type snippet from "../../interfaces/snippet";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface SnippetFullViewProps {
  snippet: snippet;
  onClose: () => void;
}

export default function SnippetFullView({
  snippet,
  onClose,
}: SnippetFullViewProps) {
  const [copied, setCopied] = useState(false);

  const highlightedCode = hljs.highlight(snippet.code, {
    language: snippet.language,
  }).value;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="w-[92vw] max-w-[880px] bg-[#121212] rounded-2xl border border-white/10
                 flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-black/60"
      style={{ maxHeight: "82vh" }}
    >
      <div
        className="relative flex flex-col bg-[#0d0d0d]
                   border-b md:border-b-0 md:border-r border-white/8
                   md:w-[55%] w-full flex-shrink-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium font-mono">
            {snippet.language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium
                       border border-white/8 bg-white/[0.03] hover:bg-white/[0.06]
                       text-white/35 hover:text-white/70
                       transition-all duration-150 cursor-pointer"
          >
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-[#F07020]" />
                  <span className="text-[#F07020]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  Copy
                </>
              )}
            </motion.span>
          </button>
        </div>

        <div
          className="flex-1 overflow-auto min-h-0"
          style={{ maxHeight: "72vh" }}
        >
          <pre
            className="text-[12.5px] text-zinc-300 font-mono leading-[1.8]
                       whitespace-pre p-5"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto flex-1 min-w-0">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
            Snippet details
          </span>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white/60 transition-colors duration-150 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-7">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
              Title
            </p>
            <p className="text-white font-semibold text-[15px] leading-snug">
              {snippet.title}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
              Description
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed">
              {snippet.description}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
              Language
            </p>
            <span
              className="self-start text-[11px] font-mono font-semibold uppercase tracking-wider
                             bg-[#F07020]/10 text-[#F07020] border border-[#F07020]/20
                             px-2.5 py-1 rounded-lg"
            >
              {snippet.language}
            </span>
          </div>

          {snippet.tags?.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center px-2.5 py-1
                               bg-[#F07020]/10 border border-[#F07020]/20
                               rounded-full text-[#F07020] text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}