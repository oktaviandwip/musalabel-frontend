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
import { useRouter, usePathname } from "next/navigation";
import type { AppDispatch, RootState } from "@/store";
import { Icon } from "@iconify/react";
import noOrder from "@/assets/Shopping Cart.svg";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.order);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const navUser = [
    { href: "/", label: "Home" },
    { href: "/products/cart", label: "Keranjang" },
    { href: "/products/orders", label: "Pesanan" },
  ];

  const navAdmin = [
    { href: "/admin", label: "Admin" },
    { href: "/admin/dashboard", label: "Dashboard" },
  ];

  const navItems = pathname.startsWith("/admin") ? navAdmin : navUser;

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
        <nav
          className={`hidden lg:flex items-center space-x-10 text-primary text-sm`}
        >
          {navItems.map((item) => {
            const isActive = pathname.endsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 ${
                  isActive ? "text-primary bg-secondary rounded-md" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {isAuth ? (
          <div className="relative flex items-center">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <Icon icon="mage:shopping-cart" className="text-2xl mr-4" />
              {totalProducts > 0 && (
                <span className="absolute top-1 right-4 transform translate-x-1/2 -translate-y-1/2 bg-destructive text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                  {totalProducts}
                </span>
              )}
            </div>

            <div
              className={`${
                isCartOpen ? "absolute top-10 -left-60" : "hidden"
              } w-72 max-h-[420px] flex-col`}
            >
              <div className="flex-1 overflow-y-auto p-2">
                {totalProducts > 0 ? (
                  <div className="border p-6 rounded-md mr-4 bg-white">
                    {items.map((item) => (
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
                    ))}
                    <Button
                      className={`${
                        totalProducts > 0 ? "flex" : "hidden"
                      } w-full bg-gradient mt-4`}
                      onClick={() => router.push("/products/cart")}
                    >
                      Keranjang Belanja
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`${
                      isCartOpen ? "flex" : "hidden"
                    } flex-col w-64 h-56 rounded-lg justify-center items-center space-y-2 bg-white border`}
                  >
                    <Image
                      src={noOrder}
                      alt="No orders"
                      width={100}
                      height={100}
                    />
                    <p className="text-center text-primary">
                      Belum ada pesanan
                    </p>
                  </div>
                )}
              </div>
            </div>

            <HoverCard>
              <div className="flex lg:hidden bg-white mt-[2px]">
                <Icon
                  icon="mage:dash-menu"
                  className="text-primary size-7"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
              <div
                className="hidden lg:flex items-center space-x-4 cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
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
              </div>
              <div
                className={`${
                  isProfileOpen ? "absolute top-14 right-0" : "hidden"
                } flex flex-col space-y-2 text-left bg-white p-4 rounded-md`}
              >
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
              </div>
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
                  width={80}
                  height={80}
                  quality={100}
                  className="bg-white rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <div className="text-lg mb-6 mt-2">{profile?.Username}</div>
            <div className="flex flex-col space-y-2 w-full">
              {isAuth ? (
                <>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() =>
                      router.push(
                        profile?.Role === "admin" ? "/admin" : "/profile"
                      )
                    }
                  >
                    {profile?.Role === "admin" ? "Admin" : "Akun"}
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
                </>
              ) : (
                <>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/signup")}
                  >
                    Daftar
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Masuk
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
