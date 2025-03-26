export interface City {
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

export interface CityState {
    cities?: City[];
    dbCities: DbCity[];
    selectedCity?: City | null;
    dbCity: DbCity | null;
    pays?: string;
    loading: boolean;
    error: string | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
    avatar?: string;
    role: "USER" | "ADMIN"; // Assurez-vous que les valeurs correspondent à l'enum Role
    profileType: "PERSONAL" | "BUSINESS"; // Assurez-vous que les valeurs correspondent à l'enum ProfileType
    businessProfile?: BusinessProfile;
    locationId?: string;
    location?: Location;
    businessProfileId?: string;
    createdAt: string; // Date sous forme de string ISO
    updatedAt: string;
    Listing: Listing[];
    Subscription: Subscription[];
    Favorite: Favorite[];
    ConversationParticipant: ConversationParticipant[];
    Message: Message[];
    Following: Follower[];
    Follower: Follower[];
}

export interface BusinessProfile {
    id: string;
    name: string;
    description?: string;
    website?: string;
}

export interface Location {
    id: string;
    country: string;
    city: string;
    latitude: number;
    longitude: number;
}

export interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
}

export interface Subscription {
    id: string;
    plan: string;
    startDate: string;
    endDate: string;
}

export interface Favorite {
    id: string;
    listingId: string;
    userId: string;
}

export interface ConversationParticipant {
    id: string;
    conversationId: string;
    userId: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

export interface Follower {
    id: string;
    followerId: string;
    followingId: string;
}