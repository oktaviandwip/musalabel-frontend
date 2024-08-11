import Image from "next/image";
import Link from "next/link";

import gamisPink from "@/assets/gamis-pink.png";
import gamisCoklat from "@/assets/gamis-coklat.png";
import gamisHijau from "@/assets/gamis-hijau.png";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative flex items-center h-[200px] sm:h-[325px] mt-24 sm:mt-14 rounded-md">
      <div className="flex flex-col items-center sm:items-start text-white bg-black w-[550px] sm:w-full pt-56 pb-10 sm:p-10 rounded-lg mt-[200px] sm:mt-0">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-1/2 lg:w-1/3 space-y-4">
          <h1 className="text-2xl text-center sm:text-left">
            Baju Muslim Wanita Berkualitas & Harga Terjangkau
          </h1>
          <div className="hidden sm:flex leading-relaxed">
            Temukan model baju wanita muslim terbaru dengan kualitas terbaik dan
            harga terjangkau di sini.
          </div>
          <Button id="model" className="w-40 bg-gradient">
            <Link href="#model">Beli Sekarang</Link>
          </Button>
        </div>
      </div>
      <div className="absolute size-52 sm:size-80 -top-28 sm:-top-20 right-28 sm:right-36">
        <Image src={gamisCoklat} alt="Gamis coklat" width={310} quality={100} />
      </div>

      <div className="absolute size-48 sm:size-72 -top-24 sm:-top-12 right-0 sm:-right-8">
        <Image src={gamisPink} alt="Gamis pink" width={260} quality={100} />
      </div>

      <div className="absolute size-56 sm:size-96 -top-24 sm:-top-20 right-8 sm:-right-2">
        <Image src={gamisHijau} alt="Gamis hijau" width={350} quality={100} />
      </div>
    </div>
  );
}
