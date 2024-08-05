"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/musalabel-logo.svg";
import photoProfile from "@/assets/photo-profile.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";
import { clearCart } from "@/store/reducer/order";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/store";
import { Icon } from "@iconify/react";
import noOrder from "@/assets/Shopping Cart.svg";

export default function Header() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.order);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalProducts = items.length;

  // Price Format
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const handleLogout = () => {
    router.push("/login");
    dispatch(logout());
    dispatch(getProfile(null));
    dispatch(clearCart());
  };

  return (
    <header className="fixed inset-x-0 flex items-center h-20 z-50 bg-white border-b-[1px]">
      <div className="flex justify-between container">
        <Link href="/">
          <Image
            src={logo}
            alt="Musalabel logo"
            width={150}
            height={150}
            quality={100}
          />
        </Link>
        <nav className="hidden lg:flex items-center space-x-14 text-primary text-sm">
          <Link href="/" className="hover:text-gray-500">
            Home
          </Link>
          <Link href="/products/cart" className="hover:text-gray-500">
            Keranjang
          </Link>
          <Link href="/products/orders" className="hover:text-gray-500">
            Pesanan
          </Link>
        </nav>
        {isAuth ? (
          <div className="relative flex items-center">
            <HoverCard>
              <HoverCardTrigger
                className="relative cursor-pointer"
                onClick={() => router.push("/products/cart")}
              >
                <Icon icon="mage:shopping-cart" className="text-2xl mr-4" />
                {totalProducts > 0 && (
                  <span className="absolute top-1 right-4 transform translate-x-1/2 -translate-y-1/2 bg-destructive text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                    {totalProducts}
                  </span>
                )}
              </HoverCardTrigger>
              <HoverCardContent className="w-72 max-h-[420px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-2">
                  {totalProducts > 0 ? (
                    items.map((item) => (
                      <Link
                        key={item.Product_id}
                        href={`/products/${item.Slug}`}
                        className="flex items-center hover:bg-secondary mb-2"
                      >
                        <Image
                          src={item.Image}
                          alt={item.Name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div className="ml-2 flex-1">
                          <p className="text-sm font-semibold">{item.Name}</p>
                          <p className="text-xs font-semibold text-gradient">
                            {formatter.format(item.Price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Size: {item.Size}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="flex flex-col justify-center items-center space-y-2">
                      <Image
                        src={noOrder}
                        alt="No orders"
                        width={50}
                        height={50}
                      />
                      <p className="text-center text-primary">
                        Belum ada pesanan
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  className={`${
                    totalProducts > 0 ? "flex" : "hidden"
                  } w-full bg-gradient mt-4`}
                  onClick={() => router.push("/products/cart")}
                >
                  Keranjang Belanja
                </Button>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <div className="flex lg:hidden bg-white mt-[2px]">
                <Icon
                  icon="mage:dash-menu"
                  className="text-primary size-7"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
              <HoverCardTrigger className="hidden lg:flex items-center space-x-4 cursor-pointer">
                <span className="text-lg">
                  {profile?.Username || "new user"}
                </span>
                <Avatar>
                  <AvatarImage
                    src={profile?.Image}
                    alt="Photo profile"
                    className="rounded-full"
                    style={{ objectFit: "cover", backgroundColor: "white" }}
                  />
                  <AvatarFallback>
                    <Image
                      src={photoProfile}
                      alt="Photo profile"
                      width={40}
                      height={40}
                      quality={100}
                      className="bg-white rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="flex flex-col space-y-2 text-left">
                <Button
                  onClick={() =>
                    router.push(
                      `${profile?.Role === "admin" ? "/admin" : "/profile"}`
                    )
                  }
                  className="bg-secondary text-primary hover:bg-primary hover:text-white"
                >
                  {profile?.Role === "admin" ? "Admin" : "Akun"}
                </Button>
                <Button
                  onClick={() => router.push("/products/orders")}
                  className="bg-secondary text-primary hover:bg-primary hover:text-white"
                >
                  Pesanan
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-secondary text-primary hover:bg-primary hover:text-white"
                >
                  Keluar
                </Button>
              </HoverCardContent>
            </HoverCard>
          </div>
        ) : (
          <div>
            <div
              className="flex lg:hidden bg-white mt-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon icon="mage:dash-menu" className="text-primary size-6" />
            </div>
            <div className="hidden lg:flex space-x-2">
              <Link href="/signup">
                <Button variant="outline">Daftar</Button>
              </Link>
              <Link href="/login">
                <Button>Masuk</Button>
              </Link>
            </div>
          </div>
        )}

        <div
          className={`fixed top-0 right-0 z-50 bg-white min-h-screen w-64 shadow-lg transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end pt-7 pr-7">
            <Icon
              icon="mage:multiply"
              height={24}
              className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="flex flex-col items-center p-4">
            <Avatar className="size-20">
              <AvatarImage
                src={profile?.Image}
                alt="Photo profile"
                className="rounded-full"
                style={{ objectFit: "cover", backgroundColor: "white" }}
              />
              <AvatarFallback>
                <Image
                  src={photoProfile}
                  alt="Photo profile"
                  width={40}
                  height={40}
                  quality={100}
                  className="bg-white rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <div className="text-lg mb-6 mt-2">{profile?.Username}</div>
            <div className="flex flex-col space-y-2 w-full">
              <Button
                variant={"secondary"}
                className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => router.push("/profile")}
              >
                Akun
              </Button>
              <Button
                variant={"secondary"}
                className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => router.push("/products/cart")}
              >
                Keranjang
              </Button>
              <Button
                variant={"secondary"}
                className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => router.push("/products/orders")}
              >
                Pesanan
              </Button>
              <Button
                variant={"secondary"}
                className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
