"use client"
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthButtons } from '@/components/auth/AuthButtons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/products/ProductList';

export default function Home() {

  return (
    <main className="container mx-auto p-4 py-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Doomi Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/products/new">
            <Button>Create Product</Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="secondary">Manage Categories</Button>
          </Link>
          <div className="border-l h-8 border-gray-300 mx-2"></div>
          <AuthButtons />
        </div>
      </header>
      
      <section>
        <h2 className="text-3xl font-bold mb-6">Product Catalog</h2>
        <ProductList />
      </section>
    </main>
  );
}
