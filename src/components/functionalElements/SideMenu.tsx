import WordMarkLogo from "../WordmarkLogo"
import { Boxes} from "lucide-react"
export default function SideMenu(){
    return(
        <div className="w-[20%] h-screen bg-[#171717] border-r-[1px] border-[#B7ADA6] lg:p-[30px]">
            <WordMarkLogo size="sm"/>
            <div className="mt-6">
            <div className="flex gap-x-2 text-[14px] font-normal items-center cursor-pointer"><Boxes strokeWidth={1}/>All Snippets</div>
            </div>
        </div>
    )
}