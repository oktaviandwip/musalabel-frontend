"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";
import { setCart } from "@/store/reducer/order";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import icon from "@/assets/musalabel-logo.svg";
import { toast } from "@/components/ui/use-toast";

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
};

export default function Login() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { data: session } = useSession();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);

  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    isGoogle: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
          ? "bg-success text-white"
          : "bg-destructive text-white"
      } fixed top-0 flex items-center justify-center inset-x-0 md:w-96 md:mx-auto p-4 border-none rounded-none md:rounded-lg z-[999]`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
      isGoogle: false,
    }));
  };

  useEffect(() => {
    if (session) {
      setData((prevData) => ({
        ...prevData,
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleLogin = () => {
    if (!session) {
      signIn("google", { callbackUrl: "/api/auth/callback-login" });
    } else {
      setData((prevData) => ({
        ...prevData,
        isGoogle: true,
      }));
    }
  };

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-10 pb-10">
      <Link href="/">
        <Image src={icon} alt="Musalabel icon" height={70} />
      </Link>
      <Card className="w-[350px] shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle>Selamat Datang 👋</CardTitle>
          <CardDescription>
            Input email dan password untuk masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                placeholder="user@mail.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                placeholder="*********"
                onChange={handleChange}
                required={!data.isGoogle} // Password not required if signed in with Google
                className="pr-10"
              />
              <Icon
                icon={showPassword ? "mage:eye-off" : "mage:eye"}
                className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                onClick={() => setShowPassword(!showPassword)}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline mt-2 self-end"
              >
                Lupa password?
              </Link>
            </div>
            <Button type="submit" className="w-full font-bold">
              Masuk
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleLogin}
          >
            <Icon icon="logos:google-icon" className="mr-2" /> Masuk dengan
            Google
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Belum memiliki akun?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
