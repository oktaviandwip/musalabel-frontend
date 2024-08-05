import Image from "next/image";
import logo from "@/assets/musalabel-logo-white.svg";

export default function Footer() {
  return (
    <footer className=" bg-black text-white p-10">
      <div className="container flex justify-between">
        <div className="flex flex-col">
          <div>Contact us</div>
          <div className="flex flex-col">
            <div>Email: musalabel@gmail.com</div>
            <div>Hp: +6285171021035</div>
          </div>
        </div>
        <Image
          src={logo}
          alt="Musalabel logo white"
          width={150}
          quality={100}
        />
      </div>
    </footer>
  );
}
