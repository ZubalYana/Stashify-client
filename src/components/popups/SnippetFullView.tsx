import { motion } from "framer-motion";
import { X } from "lucide-react";
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
  
  const highlightedCode = hljs.highlight(snippet.code, {
    language: snippet.language,
  }).value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="w-[92vw] max-w-[900px] bg-[#121212] rounded-2xl border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-black/60"
    >
      <div className="flex-1 overflow-auto bg-[#0d0d0d] p-5 border-b md:border-b-0 md:border-r border-white/10">
        <pre
          className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>

      <div className="w-full md:w-[260px] shrink-0 p-6 flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/20 hover:text-[#F07020] transition-colors duration-200 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="pr-6">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
            Title
          </p>
          <p className="text-white font-semibold text-base">{snippet.title}</p>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">
            Language
          </p>
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-wider bg-[#F07020]/10 text-[#F07020] border border-[#F07020]/20 px-2.5 py-1 rounded-lg">
            {snippet.language}
          </span>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
            Description
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            {snippet.description}
          </p>
        </div>

        {snippet.tags?.length > 0 && (
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/5 hover:bg-[#F07020]/10 border border-white/10 hover:border-[#F07020]/25 text-white/40 hover:text-[#F07020]/80 px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/8">
          <button
            onClick={onClose}
            className="
              w-full px-4 py-2.5 rounded-xl
              text-sm font-semibold uppercase tracking-wider
              text-[#F07020]/60 hover:text-[#F07020]
              border border-[#F07020]/15 hover:border-[#F07020]/40
              hover:bg-[#F07020]/5
              hover:shadow-[0_0_0_4px_rgba(240,112,32,0.08)]
              transition-all duration-200 cursor-pointer
            "
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}
