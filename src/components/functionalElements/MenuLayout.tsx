import type { ReactNode } from "react";
import SideMenu from "./SideMenu"

interface MenuLayoutProps{
    children?: ReactNode;
}
export default function MenuLayout({children}: MenuLayoutProps){
    return(
        <div className="w-full h-svh flex overflow-hidden">
            <SideMenu/>
            <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}