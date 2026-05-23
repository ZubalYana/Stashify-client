import { Plus } from "lucide-react"

interface NewSnippetProps {
  onAddNewSnippet?: () => void;
}

export default function NewSnippet({ onAddNewSnippet }: NewSnippetProps) {
  return (
    <div
      onClick={onAddNewSnippet}
      className="
        group
        w-[50px] h-[50px]
        bg-[#F07020] rounded-full cursor-pointer
        flex items-center justify-center
        fixed right-[20px] bottom-[20px] lg:right-[40px] lg:bottom-[40px]
        shadow-[0_0_0_0_rgba(240,112,32,0.5)]
        hover:scale-110 hover:bg-[#FF8533]
        hover:shadow-[0_0_0_8px_rgba(240,112,32,0.15)]
        active:scale-95
        transition-all duration-200 ease-out
      "
    >
      <Plus
        strokeWidth={3}
        className="w-[55%] text-[#3D1502] transition-transform duration-200 group-hover:rotate-90"
      />
    </div>
  )
}