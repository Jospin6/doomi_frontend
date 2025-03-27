import { Heart, Home, MessageCircle, Search, ShoppingBag, User } from "lucide-react"
import {
    IoAddCircleOutline,
    IoAddOutline,
    IoAddSharp,
    IoBriefcaseOutline,
    IoCalendarOutline,
    IoChatboxOutline,
    IoHeartOutline,
    IoHomeOutline,
    IoNotificationsOutline,
    IoPerson,
    IoPersonOutline,
    IoSearchOutline,
    IoStorefrontOutline
} from "react-icons/io5"
import { NavbarItem } from "./navbarItem"
import Link from "next/link"



export const Navbar = () => {
    return (
        <div className="flex w-full justify-between border-b px-32 h-16 items-center">
            <div className="text-3xl font-semibold">doomi</div>
            <div className="flex">
                <div className="w-[300px] flex rounded-lg bg-gray-100 items-center h-[40px] mr-4 px-[5px]">
                    <div className="h-[30px] px-2 flex justify-center items-center text-white rounded-xl bg-[#D14318]">
                        <Search size={18} />
                    </div>
                    <div className="w-full">
                        <input type="text" placeholder="Search..." className="h-[30px] w-full outline-none flex pl-2 items-center" />
                    </div>
                </div>
                <Link href="/new">
                    <div className="w-auto h-[40px] text-[14px] flex items-center justify-center text-white px-4 rounded-lg bg-[#D14318]">
                        <span>Add Listing</span>
                        <IoAddCircleOutline size={18} className="hidden" />
                    </div>
                </Link>
            </div>
            <div className="flex">
                <NavbarItem icon={<IoHomeOutline size={20} />} label={"Home"} className="ml-4" />
                <NavbarItem icon={<IoHeartOutline size={20} />} label={"Favoris"} className="ml-4" />
                <NavbarItem icon={<IoChatboxOutline size={20} />} label={"Messages"} className="ml-4" />
                <NavbarItem icon={<IoPersonOutline size={20} />} label={"Connexion"} className="ml-4" />
            </div>
        </div>
    )
}