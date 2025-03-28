"use client"
import { Navbar } from "@/components/navbar/navbar";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fetchListings, selectListings } from "@/redux/listing/listingSlice";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const listings = useSelector(selectListings)
  const dispatch = useDispatch<AppDispatch>()
  const user = useCurrentUser()

  useEffect(() => {
    dispatch(fetchListings())
  }, [])

  return <>
    <div className="w-10/12 m-auto grid grid-cols-8 gap-4">
      {
        listings.map(listing => <Card key={listing.id} className="col-span-2">
          <div>{listing.title}</div>
          <div>{listing.price}</div>
        </Card>)
      }
    </div>
  </>;
}
