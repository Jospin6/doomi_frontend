"use client"
import ListingForm from "@/components/forms/listingForm";

export default function New() {
    return <div>
        <h1 className="text-2xl py-4">New Listing</h1>
        <div className="w-8/12 px-4">
            <ListingForm />
        </div>
    </div>
}