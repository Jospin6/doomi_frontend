"use client"
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthButtons } from '@/components/auth/AuthButtons';

export default function Home() {

  return (
    <main className="p-4">
      <nav className="flex justify-end">
        <AuthButtons />
      </nav>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Doomi</h1>
        <p className="mt-4">Your application's main content goes here.</p>
      </div>
    </main>
  );
}
