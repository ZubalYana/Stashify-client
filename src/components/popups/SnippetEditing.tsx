import type snippet from "../../interfaces/snippet";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Save, Sparkles, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import ScanOverlay from "../functionalElements/ScanOverlay";
import { useNavigate } from "react-router-dom";

interface SnippetEditingProps {
  onClose: () => void;
  onEdited: (editedSnippet: snippet) => void;
  editingSnippet: snippet;
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
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function SnippetEditing({
  onClose,
  onEdited,
  editingSnippet,
}: SnippetEditingProps) {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalyzeWarning, setReanalyzeWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (!token){
    navigate('/');
  }

  useEffect(() => {
    setCode(editingSnippet.code);
    setTitle(editingSnippet.title);
    setDescription(editingSnippet.description);
    setLanguage(editingSnippet.language);
    setTags(editingSnippet.tags ?? []);
  }, []);

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

  const handleReanalyzeClick = () => {
    if (!reanalyzeWarning) {
      setReanalyzeWarning(true);
      return;
    }
    runReanalyze();
  };

  const runReanalyze = async () => {
    if (!code.trim()) return;
    setIsReanalyzing(true);
    setReanalyzeWarning(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/snippets/analyze`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           },
          body: JSON.stringify({ code }),
        }
      );
      const data = await res.json();
      setTitle(data.title);
      setDescription(data.description);
      setLanguage(data.language);
      setTags(data.tags);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const editSnippet = () => {
    setIsSaving(true);
    fetch(`${import.meta.env.VITE_API_URL}/snippets/${editingSnippet.id}`, {
      method: "PATCH",
      headers: { 
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify({ title, description, code, language, tags }),
    })
      .then((res) => res.json())
      .then((data) => {
        onEdited(data.snippet);
        onClose();
      })
      .catch((err) => {
        console.error(err);
        setIsSaving(false);
      });
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[#121212] rounded-2xl border border-white/10 flex flex-col"
      style={{
        width: "min(90vw, 980px)",
        maxWidth: "980px",
        maxHeight: "90vh",
      }}
    >
      <div className="flex items-center justify-between p-6 lg:p-8 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-white text-[22px] font-semibold tracking-tight">
            Edit snippet
          </h2>
          <p className="text-white/30 text-xs mt-0.5">{editingSnippet.title}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-5 items-stretch px-6 lg:px-8 flex-1 min-h-0">
        <div
          className="relative bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/5 flex-shrink-0"
          style={{ width: "45%", minHeight: "220px" }}
        >
          {isReanalyzing && (
            <ScanOverlay/>
          )}
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setReanalyzeWarning(false); 
            }}
            className="w-full h-full min-h-[220px] bg-transparent text-white/80 font-mono text-sm p-4 resize-none outline-none z-10 relative leading-relaxed"
            spellCheck={false}
          />
        </div>

        <motion.div
          key="fields"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 flex-1 min-w-0 overflow-y-auto pr-3"
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
              Language ( Detected by AI )
            </label>
            <p
              className="w-full text-white text-sm outline-none transition-all duration-200"
            >{language}</p>
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
      </div>

      <div className="flex items-center justify-between px-6 lg:px-8 py-4 flex-shrink-0 mt-2">
        <AnimatePresence mode="wait">
          {reanalyzeWarning ? (
            <motion.p
              key="warning"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-xs text-amber-400/80"
            >
              <AlertTriangle size={12} />
              This will overwrite your fields. Click again to confirm.
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-white/20"
            >
              {isReanalyzing
                ? "Re-analyzing..."
                : "Edit any field before saving"}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-2 ml-auto">
          <motion.button
            onClick={handleReanalyzeClick}
            disabled={isReanalyzing || !code.trim()}
            animate={
              reanalyzeWarning ? { borderColor: "rgba(251,191,36,0.4)" } : {}
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm
                       text-white/40 hover:text-white/70
                       border border-white/8 hover:border-white/20
                       rounded-xl transition-all duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={13} />
            {isReanalyzing ? "Analyzing..." : "Re-analyze"}
          </motion.button>

          <button
            onClick={editSnippet}
            disabled={isSaving || !code.trim() || !title.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl
                       transition-all duration-200 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed
                       bg-[#F07020] hover:bg-[#d96418] text-white
                       shadow-[0_0_16px_rgba(240,112,32,0.25)]
                       hover:shadow-[0_0_22px_rgba(240,112,32,0.35)]"
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
