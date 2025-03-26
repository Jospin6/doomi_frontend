"use client"
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "@/redux/user/userSlice"
import { fetchCurrentUser } from "@/redux/auth/authSlice";

export function useCurrentUser() {
    const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch]);

  return user;
}