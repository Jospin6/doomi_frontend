"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link"; import { useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Short password"),
});

type signupFormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signupFormData>({ resolver: zodResolver(schema) });

  const [error, setError] = useState("");

  const onSubmit = async (data: signupFormData) => {
    
  };

  return (
    <div className="md:w-[400px] w-[90%] bg-[#1a1a1a] shadow-amber-600 shadow-2xs mx-auto p-6">
      <div className="py-4">
        <div className="font-bold text-gray-200 md:text-xl text-lg flex items-center justify-start">Wellcome</div>
        <h2 className="md:text-2xl text-2xl font-bold mb-4 text-gray-200">Signup</h2>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label={"email"}
          name={"email"}
          className="text-white"
          type="email"
          placeholder={"Email"}
          register={register}
          errors={errors}
        />
        <InputField
          label={"password"}
          className="text-white"
          type="password"
          name={"password"}
          placeholder={"Password"}
          register={register}
          errors={errors}
        />
        <Button className="w-4/12 bg-black">{isSubmitting ? "Loading..." : `Signup`}</Button>
      </form>
      <div className="mt-4 flex text-sm justify-center">
        <span className="pr-2 text-gray-300">Have already an account ?</span>
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
