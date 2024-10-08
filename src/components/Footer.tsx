import Image from "next/image";
import logo from "@/assets/musalabel-logo-white.svg";

export default function Footer() {
  return (
    <footer className=" bg-black text-white p-10">
      <div className="container flex flex-col">
        <Image
          src={logo}
          alt="Musalabel logo white"
          width={150}
          quality={100}
        />
        <div className="flex flex-col">
          <div>Email: musalabel@gmail.com</div>
          <div>No. Telp: +6285171021035</div>
        </div>
      </div>
    </footer>
  );
}
