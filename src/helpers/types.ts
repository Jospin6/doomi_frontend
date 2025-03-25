interface City {
    value?: number | null;
    label: string;
    ville: string;
    pays: string;
    lat_lon: string;
    flag: string;
    countryCode: string
}

export interface DbCity {
    id?: string;
    country: string;
    city: string;
    latitude?: string;
    longitude?: string;
}

interface CityState {
    cities?: City[];
    dbCities: DbCity[];
    selectedCity?: City | null;
    dbCity: DbCity | null;
    pays?: string;
    loading: boolean;
    error: string | null;
}

export type {
    City,
    CityState
}