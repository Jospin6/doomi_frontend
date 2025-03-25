"use client"
import { City, DbCity } from "@/helpers/types";
import { fetchCities, fetchDbCities, setSelectedCity, selectDbCity, setDbCity } from "@/redux/cities/citySlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'

export default function Location() {
    const dispatch = useDispatch<AppDispatch>(); 
    const cities = useSelector((state: RootState) => state.city.dbCities);
    const loading = useSelector((state: RootState) => state.city.loading); 
    const error = useSelector((state: RootState) => state.city.error);
    const [inputValue, setInputValue] = useState<string>('');
    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    useEffect(() => {
        if (inputValue) {
            dispatch(fetchDbCities(inputValue));
        }
    }, [inputValue, dispatch]);

    const handleCityChange = (selectedOption: DbCity | null) => {
        dispatch(setDbCity(selectedOption));
        if (selectedOption) {
            console.log('Ville sélectionnée:', selectedOption);
        }
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: 'lightgray',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'blue',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'blue' : state.isFocused ? 'lightgray' : 'white',
            color: state.isSelected ? 'white' : 'black',
        }),
    };

    return <div>
        <Select
            options={cities}
            onChange={handleCityChange}
            onInputChange={handleInputChange}
            placeholder="Tapez le nom de votre ville..."
            isClearable
            isLoading={loading}
            styles={customStyles}
        />
        {error && <p className="text-red-500">{error}</p>}
    </div>
}