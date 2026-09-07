import type { ReactNode } from "react";
import SideMenu from "./SideMenu"

interface MenuLayoutProps{
    children?: ReactNode;
}
export default function MenuLayout({children}: MenuLayoutProps){
    return(
        <div className="w-full h-svh flex overflow-hidden">
            <SideMenu/>
            <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
