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
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import icon from "@/assets/musalabel-logo.svg";
import { signIn, useSession } from "next-auth/react";

type Data = {
  phone_number: string;
  email: string;
  password: string;
  confirmPass: string;
  image: string;
  isGoogle: boolean;
};

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState<Data>({
    phone_number: "",
    email: "",
    password: "",
    confirmPass: "",
    image: "",
    isGoogle: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const { data: session } = useSession();

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "phone_number") {
      const numericValue = value.replace(/\D/g, "");
      setData((prevData) => ({
        ...prevData,
        [id]: numericValue,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  // Handle Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Signup failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleSignup = () => {
    signIn("google");
  };

  useEffect(() => {
    if (session) {
      setData((prevData) => ({
        ...prevData,
        email: session.user?.email || "",
        image: session.user?.image || "",
        isGoogle: true,
      }));
      handleSubmit();
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-10 py-10">
      <Link href="/">
        <Image src={icon} alt={"Musalabel icon"} height={70} />
      </Link>
      <Card className="w-[350px] shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle>Daftar Akun 📝</CardTitle>
          <CardDescription>
            Isi detail di bawah untuk buat akun baru
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
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone_number">No. Telp</Label>
              <Input
                id="phone_number"
                type="text"
                value={data.phone_number}
                placeholder="085171021035"
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
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
                required
                className="pr-10"
              />
              <Icon
                icon={showPassword ? "mage:eye-off" : "mage:eye"}
                className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="flex flex-col space-y-2 relative">
              <Label htmlFor="confirmPass">Konfirmasi Password</Label>
              <Input
                id="confirmPass"
                type={showConfirmPass ? "text" : "password"}
                value={data.confirmPass}
                placeholder="*********"
                onChange={handleChange}
                required
                className="pr-10"
              />
              <Icon
                icon={showConfirmPass ? "mage:eye-off" : "mage:eye"}
                className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="size-5 border-gray-300"
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Terima syarat dan ketentuan
              </Label>
            </div>

            <Button type="submit" className="w-full font-bold">
              Daftar
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleSignup}
          >
            <Icon icon="logos:google-icon" className="mr-2" /> Daftar dengan
            Google
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
