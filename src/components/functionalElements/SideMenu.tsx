import WordMarkLogo from "../WordmarkLogo";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Boxes,
  BrainCircuit,
  Library,
  ChevronRight,
  CircuitBoard,
  Radiation,
  ChartBarIncreasing,
  Plus,
  User,
  Settings,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ReactNode;
}

const chevronVariants = {
  closed: { rotate: 0 },
  open: { rotate: 90 },
};

interface CollapsibleSectionProps {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
  addLabel: string;
  shouldReduceMotion: boolean | null;
}

function CollapsibleSection({
  label,
  icon,
  items,
  addLabel,
  shouldReduceMotion,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-[14px] font-normal
                   text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                   hover:bg-white/[0.04] active:bg-white/[0.06]
                   transition-colors duration-150 cursor-pointer"
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      >
        <div className="flex items-center gap-x-2">
          {icon}
          <span>{label}</span>
        </div>
        <motion.span
          variants={chevronVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="text-[#B7ADA6]"
        >
          <ChevronRight strokeWidth={1} size={16} />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="flex pl-[14px] pt-2 pb-1 gap-x-3">
              <motion.div className="w-[1.5px] rounded-full bg-[#F07020] self-stretch flex-shrink-0" />

              <div className="flex flex-col gap-y-[2px] flex-1 min-w-0">
                {items.map((item, index) => (
                  <motion.button
                    key={index}
                    className="w-full flex items-center gap-x-2 text-[13px] font-normal
                               text-[#B7ADA6] hover:text-white rounded-[10px] px-2 py-[7px]
                               hover:bg-white/[0.04] active:bg-white/[0.06]
                               transition-colors duration-150 cursor-pointer text-left"
                    whileHover={shouldReduceMotion ? {} : { x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="flex-shrink-0 opacity-70">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </motion.button>
                ))}

                <motion.button
                  className="flex items-center gap-x-[6px] text-[12px] font-medium
                             text-[#F07020]/70 hover:text-[#F07020] px-2 py-[6px] mt-1
                             transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={13} strokeWidth={2} />
                  {addLabel}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SideMenu() {
  const shouldReduceMotion = useReducedMotion();

  const placeholderProjects: NavItem[] = [
    { title: "Project 1", icon: <CircuitBoard size={15} strokeWidth={1} /> },
    { title: "Project 2", icon: <Radiation size={15} strokeWidth={1} /> },
    {
      title: "Project 3",
      icon: <ChartBarIncreasing size={15} strokeWidth={1} />,
    },
  ];

  const placeholderCollections: NavItem[] = [
    { title: "Auth snippets", icon: <Library size={15} strokeWidth={1} /> },
    { title: "Risky features", icon: <Radiation size={15} strokeWidth={1} /> },
    {
      title: "Custom loaders",
      icon: <CircuitBoard size={15} strokeWidth={1} />,
    },
  ];

  return (
    <div
      className="w-[240px] h-screen bg-[#171717] border-r border-[#B7ADA6]/10
                 flex flex-col lg:px-[18px] lg:py-[28px]"
    >
      <div className="px-1 mb-8">
        <WordMarkLogo size="sm" />
      </div>

      <nav className="flex flex-col gap-y-2 flex-1 min-h-0">
        <motion.button
          className="w-full flex items-center gap-x-2 text-[14px] font-normal
                     text-white bg-white/[0.06] rounded-[12px] px-3 py-2
                     hover:bg-white/[0.08] transition-colors duration-150 cursor-pointer"
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        >
          <Boxes size={16} strokeWidth={1} />
          All Snippets
        </motion.button>
        <CollapsibleSection
          label="Projects"
          icon={<BrainCircuit size={16} strokeWidth={1} />}
          items={placeholderProjects}
          addLabel="Add new project"
          shouldReduceMotion={shouldReduceMotion}
        />
        <CollapsibleSection
          label="Collections"
          icon={<Library size={16} strokeWidth={1} />}
          items={placeholderCollections}
          addLabel="Add new collection"
          shouldReduceMotion={shouldReduceMotion}
        />
      </nav>
      <div className="flex flex-col gap-y-[2px] pt-4 border-t border-white/[0.05]">
        {[
          { label: "Profile", icon: <User size={16} strokeWidth={1} /> },
          { label: "Settings", icon: <Settings size={16} strokeWidth={1} /> },
        ].map(({ label, icon }) => (
          <motion.button
            key={label}
            className="w-full flex items-center gap-x-2 text-[13px] font-normal
                       text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                       hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            {icon}
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
