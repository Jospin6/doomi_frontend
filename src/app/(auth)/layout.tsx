import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Doomi",
    description: "Doomi authentication",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`bg-white fixed left-0 top-0 z-50 w-full flex h-screen`}
        >
            <div className="w-6/12 h-screen">
                {children}
            </div>
            <div className="w-6/12 h-screen bg-amber-700 bg-[url('/sideimage.jpg')] bg-cover bg-center">
                <div className="h-full w-full bg-black/70 flex flex-col items-center justify-end pb-10">
                    <div className="text-white text-4xl font-semibold">
                        <div className="text-6xl font-bold">doomi</div>
                        <div className="text-2xl font-light">Find your dream home</div>
                    </div>
                </div>
            </div>
        </div>
    );
}