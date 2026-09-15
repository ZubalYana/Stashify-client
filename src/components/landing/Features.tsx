import { Boxes, BrainCircuit, Library, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Boxes size={18} strokeWidth={1.5} />,
    title: "Snippets",
    text: "Save code with title, tags, and syntax highlighting.",
  },
  {
    icon: <BrainCircuit size={18} strokeWidth={1.5} />,
    title: "Projects",
    text: "File snippets into one workspace. Move, don’t copy.",
  },
  {
    icon: <Library size={18} strokeWidth={1.5} />,
    title: "Collections",
    text: "Group by topic without pulling them out of a project.",
  },
  {
    icon: <Sparkles size={18} strokeWidth={1.5} />,
    title: "AI summary",
    text: "Paste code and get a title, description, language, and tags.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-16 pb-24 scroll-mt-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F07020]/10 border border-[#F07020]/20 flex items-center justify-center text-[#F07020] mb-3">
              {feature.icon}
            </div>
            <h2 className="text-white text-[15px] font-semibold mb-1">
              {feature.title}
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
