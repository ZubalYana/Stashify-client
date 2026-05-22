import type { ReactNode } from "react";
import SideMenu from "./SideMenu"

interface MenuLayoutProps{
    children?: ReactNode;
}
export default function MenuLayout({children}: MenuLayoutProps){
    return(
        <div className="w-full flex-1 flex">
            <SideMenu/>
            {children}
        </div>
    )
}