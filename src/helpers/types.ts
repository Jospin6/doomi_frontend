interface City {
    value: number;
    label: string;
    ville: string;
    pays: string;
    lat_lon: string;
    flag: string;
    countryCode: string
}

interface CityState {
    cities: City[];
    selectedCity: City | null;
    pays: string;
    loading: boolean;
    error: string | null;
}

export type {
    City,
    CityState
}