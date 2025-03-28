import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addLocation } from "@/redux/cities/citySlice";


const locationSchema = z.object({
    country: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    city: z.string(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

export const LocationForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema)
    });


    const onSubmit = async (data: LocationFormData) => {
        dispatch(addLocation(data));
        console.log(data)
        reset()
    };

    return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-md">
        <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
                type="text"
                {...register("country")}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Country"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
                type="text"
                {...register("city")}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
                type="text"
                {...register("latitude")}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Latitude"
            />
            {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
                type="text"
                {...register("longitude")}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Longitude"
            />
            {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
        </div>

        <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
            Add
        </button>
    </form>
}