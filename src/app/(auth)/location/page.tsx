"use client"
import { City, DbCity } from "@/helpers/types";
import { fetchCities, fetchDbCities, setSelectedCity, selectDbCity, setDbCity } from "@/redux/cities/citySlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Console } from "console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'
import { redirect } from "next/navigation";

export default function Location() {
    const dispatch = useDispatch<AppDispatch>();
    const cities = useSelector((state: RootState) => state.city.dbCities);
    const loading = useSelector((state: RootState) => state.city.loading);
    const error = useSelector((state: RootState) => state.city.error);
    const [inputValue, setInputValue] = useState<string>('');
    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const cityOptions = cities.map((city) => ({
        label: `${city.country} - ${city.city}`, 
        value: city,
    }));

    useEffect(() => {
        dispatch(fetchDbCities(inputValue));
    }, [dispatch]);

    const handleChange = (selectedOption: any) => {
        if (selectedOption) {
            dispatch(setDbCity(selectedOption.value));
            redirect("/signup")
        }
    };

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused ? "#2563EB" : "lightgray", // Bleu au focus
            boxShadow: state.isFocused ? "0 0 5px rgba(37, 99, 235, 0.5)" : "none",
            borderWidth: "2px",
            borderRadius: "8px",
            padding: "4px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
                borderColor: "#2563EB",
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#2563EB"
                : state.isFocused
                    ? "#E0E7FF"
                    : "white",
            color: state.isSelected ? "white" : "#111827",
            padding: "10px",
            borderRadius: "4px",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#BFDBFE",
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "#6B7280",
            fontStyle: "italic",
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: "#111827", // S'assure que le texte est bien visible
            fontWeight: "500",
            fontSize: "16px",
        }),
    };

    return <div className="h-screen">
        <div className="text-3xl h-[80px] flex items-center pl-4 font-bold">
            <IoArrowBack size={20} className="mr-3" />
            <span>doomi</span>
        </div>
        <div className="w-8/12 m-auto ">
            <h1 className="text-xl font-semibold mb-4">Choose your location</h1>
            <Select
                options={cityOptions}
                onChange={handleChange}
                onInputChange={handleInputChange}
                placeholder="Tapez le nom de votre ville..."
                isClearable
                isLoading={loading}
                styles={customStyles}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    </div>
}