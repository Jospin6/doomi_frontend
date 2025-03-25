import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { selectAcoountType, signup, signupDataProps } from "@/redux/auth/authSlice";
import { fetchDbCities, selectDbCity, selectSelectedCity } from "@/redux/cities/citySlice";

const schema = z.object({
    name: z.string().min(3, "Minimum 3 characters for the name"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});

type FormValues = z.infer<typeof schema>;

export default function Signup() {
    const userProfileType = useSelector(selectAcoountType)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const dispatch = useDispatch<AppDispatch>();
    const dbCity = useSelector(selectDbCity)

    const [error, setError] = useState("");

    const onSubmit = async (data: FormValues) => {
        setError("");

        try {
            const allData: signupDataProps = {
                name: data.name,
                password: data.password,
                email: data.email,
                profileType: userProfileType!,
                locationId: dbCity?.id!
            }
            const response = await dispatch(signup(allData)).unwrap();
            if (response.data.message) {
                setError(response.data.message);
                return
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
        }
        redirect("/");
    };
    return <div className="p-4">
        <div className="text-3xl font-bold flex items-center"><IoArrowBack size={20} className="mr-3" /> <span>doomi</span></div>
        <div className="mt-6 w-8/12 m-auto">
            <div>
                <h1 className="text-xl font-semibold">Wellcome to doomi</h1>
                <span className="text-[14px] text-gray-600 mb-3">Enter your name, email, and password to signin</span>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                        <label htmlFor="name" className="block text-sm">Name</label>
                        <input type="text" {...register("name")} id="name" className="outline-none bg-transparent w-full border-b-2 py-2" placeholder="Your name" />
                        {errors.name?.message && <p className="text-red-500">{String(errors.name.message)}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="email" className="block text-sm">Email</label>
                        <input type="text" {...register("email")} id="email" className="outline-none bg-transparent w-full border-b-2 py-2" placeholder="Your email" />
                        {errors.email?.message && <p className="text-red-500">{String(errors.email.message)}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm">Password</label>
                        <input type="password" {...register("password")} id="password" className="outline-none w-full bg-transparent border-b-2 py-2" placeholder="Your password" />
                        {errors.password?.message && <p className="text-red-500">{String(errors.password.message)}</p>}
                    </div>
                    <button className="w-full h-[35px] rounded-lg bg-[#D14318] text-white mt-10">Sign in</button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-[14px] text-gray-600 mr-2">Already have account?</span>
                    <Link href="/signin" className="text-[14px] text-[#D14318]">Sign in</Link>
                </div>
            </div>
        </div>
    </div>
}