"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

type Data = {
  phone_number: string;
  email: string;
  password: string;
  confirmPass: string;
  image: string;
  isGoogle: boolean;
};

export default function AuthCallback() {
  const router = useRouter();
  const [data, setData] = useState<Data>({
    phone_number: "",
    email: "",
    password: "",
    confirmPass: "",
    image: "",
    isGoogle: false,
  });

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

  const handleSubmit = async () => {
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
        const responseData = await response.json();
        handleToast("error", responseData.description);
        console.error("Signup failed:", responseData.description);
        router.push("/signup");
      }
    } catch (error) {
      console.error("Error:", error);
      router.push("/signup");
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setData((prevData) => ({
          ...prevData,
          email: session.user?.email || "",
          image: session.user?.image || "",
          isGoogle: true,
        }));
      } else {
        router.push("/signup");
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
