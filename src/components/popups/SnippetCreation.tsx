import { useState } from "react";
import { X, Braces, Plus, Sparkles, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SnippetCreationProps {
  onClose: () => void;
}

interface SnippetAnalysis {
  title: string;
  description: string;
  language: string;
  tags: string[];
}

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export default function SnippetCreation({ onClose }: SnippetCreationProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const generateResponse = async (code: string) => {
    try {
      if (!code.trim()) return;
      setIsLoading(true);
      setIsGenerated(false);

      const aiResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/snippets/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await aiResponse.json();
      console.log("raw data:", data);
      const analysis: SnippetAnalysis = data;

      setTitle(analysis.title);
      setDescription(analysis.description);
      setLanguage(analysis.language);
      setTags(analysis.tags);
      setIsLoading(false);
      setIsGenerated(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setNewTag("");
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    // TODO: call POST /snippets with { code, title, description, language, tags }
    onClose();
  };

  return (
    <motion.div
  layout
  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  className="bg-[#121212] rounded-2xl border border-white/10 flex flex-col"
  style={{
    width: "min(90vw, 980px)",
    maxWidth: isGenerated ? "980px" : "720px",
    maxHeight: "90vh",
  }}
>
  <div className="flex items-center justify-between p-6 lg:p-8 pb-4 flex-shrink-0">
            <h2 className="text-white text-[22px] font-semibold tracking-tight">
          New snippet
        </h2>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

  <div className="flex gap-5 items-stretch px-6 lg:px-8 flex-1 min-h-0">  
        <div
          className="relative bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/5 flex-shrink-0 transition-all duration-400"
          style={{ width: isGenerated ? "45%" : "100%", minHeight: "220px" }}
        >
          {!code && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none">
              <Braces size={40} className="text-white/8" />
              <span className="text-white/20 text-sm">
                Paste your code here
              </span>
            </div>
          )}

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full min-h-[220px] bg-transparent text-white/80 font-mono text-sm p-4 resize-none outline-none z-10 relative leading-relaxed"
            spellCheck={false}
          />

          {/* Scan animation */}
          {isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F07020] to-transparent animate-scan" />
              <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-[#F07020]/8 to-transparent animate-scan" />
            </div>
          )}

          {/* Overlay tint while loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-[#0d0d0d]/40 pointer-events-none" />
          )}
        </div>
        <AnimatePresence>
          {isGenerated && (
            <motion.div
              key="fields"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-4 flex-1 min-w-0 overflow-y-auto pr-1"
            >
              <motion.div
                variants={fieldVariants}
                className="flex flex-col gap-1.5"
              >
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 placeholder:text-white/20"
                  placeholder="Snippet title"
                />
              </motion.div>
              <motion.div
                variants={fieldVariants}
                className="flex flex-col gap-1.5"
              >
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-2 text-white/80 text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 resize-none leading-relaxed placeholder:text-white/20"
                  placeholder="What does this snippet do?"
                />
              </motion.div>
              <motion.div
                variants={fieldVariants}
                className="flex flex-col gap-1.5"
              >
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Language
                </label>
                <input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 placeholder:text-white/20"
                  placeholder="e.g. TypeScript"
                />
              </motion.div>
              <motion.div
                variants={fieldVariants}
                className="flex flex-col gap-1.5"
              >
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-1.5">
                  <AnimatePresence>
                    {tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#F07020]/10 border border-[#F07020]/20 rounded-full text-[#F07020] text-xs font-medium"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="text-[#F07020]/50 hover:text-[#F07020] transition-colors ml-0.5 cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 placeholder:text-white/20"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg text-white/60 hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

  <div className="flex items-center justify-between px-6 lg:px-8 py-4 flex-shrink-0 border-t border-white/5 mt-2">        <p
          className={`text-xs transition-all duration-300 ${
            isLoading
              ? "text-white/35"
              : isGenerated
              ? "text-[#F07020]/70"
              : "opacity-0"
          }`}
        >
          {isLoading
            ? "Analyzing your code..."
            : isGenerated
            ? "Summary ready — edit before saving"
            : ""}
        </p>

        <div className="flex gap-2 ml-auto">
          {isGenerated && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                setIsGenerated(false);
                setTitle("");
                setDescription("");
                setLanguage("");
                setTags([]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-white/40 hover:text-white/70 border border-white/8 hover:border-white/15 rounded-xl transition-all duration-150 cursor-pointer"
            >
              Re-analyze
            </motion.button>
          )}

          <button
            onClick={isGenerated ? handleSave : () => generateResponse(code)}
            disabled={isLoading || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#F07020] hover:bg-[#d96418] text-white shadow-[0_0_16px_rgba(240,112,32,0.25)] hover:shadow-[0_0_22px_rgba(240,112,32,0.35)]"
          >
            {isGenerated ? (
              <>
                <Save size={14} />
                Save snippet
              </>
            ) : (
              <>
                <Sparkles size={14} />
                {isLoading ? "Analyzing..." : "Generate summary"}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
