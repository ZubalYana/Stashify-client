import type { ReactNode } from "react";
import { LayoutGrid, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WordMarkLogo from "../WordmarkLogo";
import { getSession } from "../../utils/session";

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full border border-white/12
                 bg-white/[0.03] text-white/70
                 hover:border-[#F07020]/50 hover:bg-[#F07020]/12 hover:text-[#F07020]
                 hover:shadow-[0_0_0_4px_rgba(240,112,32,0.14)]
                 transition-all duration-200 cursor-pointer"
    >
      {children}
    </button>
  );
}

export default function LandingHeader() {
  const navigate = useNavigate();
  const loggedIn = Boolean(getSession());

  return (
    <header className="relative z-20 flex shrink-0 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 pt-4 pb-1">
      <WordMarkLogo size="sm" />
      <div className="flex items-center gap-2">
        <HeaderIconButton
          label={loggedIn ? "Open profile" : "Log in"}
          onClick={() => navigate(loggedIn ? "/profile" : "/auth")}
        >
          <UserRound size={16} strokeWidth={1.75} />
        </HeaderIconButton>
        <HeaderIconButton
          label={loggedIn ? "Open app" : "Go to app"}
          onClick={() => navigate(loggedIn ? "/snippets" : "/auth")}
        >
          <LayoutGrid size={16} strokeWidth={1.75} />
        </HeaderIconButton>
      </div>
    </header>
  );
}
