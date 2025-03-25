"use client"
import { City } from "@/helpers/types";
import { fetchCities, setSelectedCity } from "@/redux/cities/citySlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'

export default function Location() {
    const dispatch = useDispatch<AppDispatch>();
    const selectedCity = useSelector((state: RootState) => state.city.selectedCity); // Récupération de la ville sélectionnée depuis Redux
    const cities = useSelector((state: RootState) => state.city.cities); // Récupération des villes depuis Redux
    const loading = useSelector((state: RootState) => state.city.loading); // État de chargement
    const error = useSelector((state: RootState) => state.city.error); // État d'erreur
    const [inputValue, setInputValue] = useState<string>('');
    const router = useRouter()
    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    useEffect(() => {
        if (inputValue) {
            dispatch(fetchCities(inputValue));
        }
    }, [inputValue, dispatch]);

    const handleCityChange = (selectedOption: City | null) => {
        dispatch(setSelectedCity(selectedOption)); // Met à jour la ville sélectionnée dans Redux
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