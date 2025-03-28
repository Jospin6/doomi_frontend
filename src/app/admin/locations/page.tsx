"use client"
import { LocationForm } from "@/components/forms/locationForm";
import { fetchDbCities, selectDbCities } from "@/redux/cities/citySlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";

export default function Locations () {
    const dispatch = useDispatch<AppDispatch>()
    const cities = useSelector(selectDbCities)
    console.log("cities: ", cities)

    useEffect(() => {
        dispatch(fetchDbCities())
        redirect("/signup")
    }, [dispatch])


    return <div className="grid grid-cols-6 gap-4 pt-4">
        <div className="col-span-4">
            {cities.map(city => (<p key={city.id}>
                {city.country} - {city.city}
            </p>))}
        </div>
        <div className="col-span-2">
            <LocationForm/>
        </div>
    </div>
}