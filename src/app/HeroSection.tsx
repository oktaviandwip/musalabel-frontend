import Image from "next/image";
import Link from "next/link";

import gamisPink from "@/assets/gamis-pink.png";
import gamisCoklat from "@/assets/gamis-coklat.png";
import gamisHijau from "@/assets/gamis-hijau.png";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative mt-24 md:mt-28">
      <div className="flex flex-col items-center md:items-start text-white bg-black w-full pt-56 p-10 md:py-10 rounded-lg">
        <div className="flex flex-col items-center md:items-start md:w-1/3 space-y-4">
          <h1 className="text-2xl text-center md:text-left">
            Baju Muslim Wanita Berkualitas & Harga Terjangkau
          </h1>
          <div className="hidden md:flex leading-relaxed">
            Temukan model baju wanita muslim terbaru dengan kualitas terbaik dan
            harga terjangkau di sini.
          </div>
          <Button id="model" className="w-40 bg-gradient">
            <Link href="#model">Beli Sekarang</Link>
          </Button>
        </div>
      </div>
      <div className="absolute -top-28 md:right-96 inset-x-0 mx-auto">
        <div className="relative">
          <div className="absolute size-52 md:size-80 right-32 -top-5 inset-x-0 mx-auto md:inset-full md:-ml-20 md:-mt-9">
            <Image
              src={gamisCoklat}
              alt="Gamis coklat"
              width={310}
              quality={100}
            />
          </div>
          <div className="absolute size-48 md:size-72 -right-28 inset-x-0 mx-auto md:inset-full md:ml-28">
            <Image src={gamisPink} alt="Gamis pink" width={260} quality={100} />
          </div>
          <div className="absolute size-56 md:size-96 -right-5 inset-x-0 mx-auto md:inset-full md:ml-0 md:-mt-6">
            <Image
              src={gamisHijau}
              alt="Gamis hijau"
              width={350}
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
