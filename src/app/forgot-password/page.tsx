"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import icon from "@/assets/musalabel-logo.svg";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast"; // Import toast correctly

type Data = {
  email: string;
  pin: string;
  newPassword: string;
  confirmPassword: string;
};

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "PIN min. harus 6 karakter",
  }),
});

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<Data>({
    email: "",
    pin: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pin, setPin] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      }
    );

    if (response.ok) {
      const { data } = await response.json();
      setPin(data);
      setStep(2);
      startCountdown();
    } else {
      const errorData = await response.json();
      setError(errorData.message);
    }
  };

  const handleToast = (desc: string) => {
    toast({
      description: desc,
      className:
        "bg-secondary text-primary absolute flex justify-center w-72 bottom-10 right-4",
    });
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords tidak sama!");
      return;
    }

    // Update the password
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.newPassword,
        }),
      }
    );

    if (response.ok) {
      handleToast("Password updated successfully!");
      router.push("/login");
    } else {
      const errorData = await response.json();
      setError(errorData.message);
    }
  };

  // Countdown logic
  const startCountdown = () => {
    setIsCountdownActive(true);
    setCountdown(59);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }

    return () => clearInterval(timer);
  }, [isCountdownActive, countdown]);

  // Input PIN
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setError("");

    if (data.pin === pin) {
      setStep(3);
    } else {
      setError("Invalid PIN");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-10 py-10">
      <Link href="/">
        <Image src={icon} alt="Musalabel icon" height={70} />
      </Link>
      <Card className="w-[350px] shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle>
            {step === 1
              ? "Verifikasi Email"
              : step === 2
              ? "Masukkan PIN"
              : "Buat Password Baru"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Masukkan email untuk mendapatkan PIN"
              : step === 2
              ? "Masukkan PIN yang dikirimkan ke email"
              : "Masukkan password baru Anda"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              step === 1
                ? handleSubmitEmail
                : step === 2
                ? form.handleSubmit(onSubmit)
                : handleSubmitNewPassword
            }
            className="space-y-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {step === 1 && (
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
            )}

            {step === 2 && (
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="pin">PIN</Label>
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="flex justify-between w-full">
                              <InputOTPSlot
                                index={0}
                                className="border border-gray-400 rounded-md"
                              />
                              <InputOTPSlot
                                index={1}
                                className="border border-gray-400 rounded-md"
                              />
                              <InputOTPSlot
                                index={2}
                                className="border border-gray-400 rounded-md"
                              />
                              <InputOTPSlot
                                index={3}
                                className="border border-gray-400 rounded-md"
                              />
                              <InputOTPSlot
                                index={4}
                                className="border border-gray-400 rounded-md"
                              />
                              <InputOTPSlot
                                index={5}
                                className="border border-gray-400 rounded-md"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="relative flex flex-col space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={data.newPassword}
                    placeholder="*********"
                    onChange={handleChange}
                    className="pr-10"
                    required
                  />
                  <Icon
                    icon={showNewPassword ? "mage:eye-off" : "mage:eye"}
                    className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>
                <div className="relative flex flex-col space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.confirmPassword}
                    placeholder="*********"
                    onChange={handleChange}
                    className="pr-10"
                    required
                  />
                  <Icon
                    icon={showConfirmPassword ? "mage:eye-off" : "mage:eye"}
                    className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              {step === 1
                ? "Send PIN"
                : step === 2
                ? "Verify PIN"
                : "Update Password"}
            </Button>

            {step === 2 && (
              <div className="text-center text-sm">
                <span className="text-gray-500">Belum dapat email? </span>
                <span
                  className={`text-blue-600 ${
                    isCountdownActive
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer hover:underline"
                  }`}
                  onClick={isCountdownActive ? undefined : handleSubmitEmail}
                >
                  Kirim ulang
                </span>
                {isCountdownActive && (
                  <span className="ml-2 text-gray-300">({countdown} d)</span>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
