import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function Signin() {
    return <div className="p-4">
        <div className="text-3xl font-bold flex items-center"><IoArrowBack size={20} className="mr-3"/> <span>doomi</span></div>
        <div className="mt-6 w-8/12 m-auto">
            <div>
                <h1 className="text-xl font-semibold">Wellcome back to doomi</h1>
                <span className="text-[14px] text-gray-600">Enter your email to signin</span>
                <div className="mt-8">
                    <label htmlFor="email" className="block text-sm">Email</label>
                    <input type="text" id="email" className="outline-none bg-transparent w-full border-b-2 py-2" placeholder="Your email" />
                </div>
                <div className="mt-4">
                    <label htmlFor="password" className="block text-sm">Password</label>
                    <input type="password" id="password" className="outline-none w-full bg-transparent border-b-2 py-2" placeholder="Your password" />
                </div>
                <button className="w-full h-[35px] rounded-lg bg-[#D14318] text-white mt-10">Sign up</button>
                <div className="mt-4 text-center">
                    <span className="text-[14px] text-gray-600 mr-2">Don't have an account?</span>
                    <Link href="/account-type" className="text-[14px] text-[#D14318]">Sign up</Link>
                </div>
            </div>
        </div>
    </div>
}