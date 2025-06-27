"use client"
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="container mx-auto p-4 py-8">
      WELLCOM TO DOOMI
    </main>
  );
}
