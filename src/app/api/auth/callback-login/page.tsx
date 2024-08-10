"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { login } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";
import { setCart } from "@/store/reducer/order";

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
};

export default function AuthCallback() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);

  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    isGoogle: false,
  });

  useEffect(() => {
    if (isAuth) {
      if (profile?.Role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuth, profile, router]);

  const handleToast = (type: "success" | "error", desc: string) => {
    toast({
      description: desc,
      className: `${
        type === "success"
          ? "bg-secondary text-primary"
          : "bg-destructive text-white"
      } fixed top-0 flex items-center justify-center inset-x-0 p-4 border-none rounded-none`,
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const { Token, User } = responseData.data;

        if (Token && User) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${User.Id}`,
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          );

          if (res.ok) {
            const resData = await res.json();
            dispatch(getProfile(User));
            dispatch(login(Token));
            dispatch(setCart(resData.data || []));
          } else {
            console.error("Failed to fetch orders:", res.statusText);
          }
        } else {
          console.error("Invalid response data:", responseData);
        }
      } else {
        const data = await response.json();
        handleToast("error", data.description);
        console.error("Login failed:", data.description);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setData((prevData) => ({
          ...prevData,
          email: session.user?.email || "",
          isGoogle: true,
        }));
      } else {
        router.push("/login");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

  return <div></div>;
}
