"use client"
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthButtons } from '@/components/auth/AuthButtons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {

  return (
    <main className="p-4">
      <nav className="flex justify-end">
        <AuthButtons />
      </nav>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Doomi</h1>
        <p className="mt-4">Your application's main content goes here.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/products/new">
            <Button>Create Product</Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="secondary">Manage Categories</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
