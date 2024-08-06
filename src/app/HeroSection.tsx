import Image from "next/image";
import Link from "next/link";

import gamisPink from "@/assets/gamis-pink.png";
import gamisCoklat from "@/assets/gamis-coklat.png";
import gamisHijau from "@/assets/gamis-hijau.png";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <>
      <div className="relative flex items-center h-[200px] sm:h-[325px] mt-24 sm:mt-14 rounded-md">
        <div className="flex flex-col items-center text-white bg-black w-[550px] pt-56 pb-10 sm:p-10 gap-y-6 rounded-lg mt-[200px]">
          <h1 className="text-2xl text-center">
            Baju Muslim Wanita Berkualitas & Harga Terjangkau
          </h1>
          <div className="hidden sm:flex leading-relaxed">
            Temukan model baju wanita muslim terbaru dengan kualitas terbaik dan
            harga terjangkau di sini.
          </div>
          <Button asChild className="w-40 bg-gradient">
            <Link href="/">Beli Sekarang</Link>
          </Button>
        </div>
        <div className="absolute size-52 -top-28">
          <Image
            src={gamisCoklat}
            alt="Gamis coklat"
            width={310}
            quality={100}
            className="absolute right-2 sm:right-56"
          />
        </div>

        <div className="absolute size-48 -top-24">
          <Image
            src={gamisPink}
            alt="Gamis pink"
            width={260}
            quality={100}
            className="absolute -right-32 sm:right-8"
          />
        </div>

        <div className="absolute size-56 -top-24">
          <Image
            src={gamisHijau}
            alt="Gamis hijau"
            width={350}
            quality={100}
            className="absolute -right-14 sm:right-20"
          />
        </div>
      </div>
    </>
  );
}
