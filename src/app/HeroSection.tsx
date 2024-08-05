import Image from "next/image";
import Link from "next/link";

import gamisPink from "@/assets/gamis-pink.png";
import gamisCoklat from "@/assets/gamis-coklat.png";
import gamisHijau from "@/assets/gamis-hijau.png";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <>
      <div className="relative flex items-center h-[325px] bg-black mt-14">
        <div className="flex flex-col text-white w-[550px] p-10 gap-y-6">
          <h1>Baju Muslim Wanita Berkualitas & Harga Terjangkau</h1>
          <div className="leading-relaxed">
            Temukan model baju wanita muslim terbaru dengan kualitas terbaik dan
            harga terjangkau di sini.
          </div>
          <Button asChild className="w-40 bg-gradient">
            <Link href="/">Beli Sekarang</Link>
          </Button>
        </div>
        <Image
          src={gamisCoklat}
          alt="Gamis pink"
          width={310}
          quality={100}
          className="absolute right-56"
        />
        <Image
          src={gamisPink}
          alt="Gamis pink"
          width={260}
          quality={100}
          className="absolute right-8"
        />
        <Image
          src={gamisHijau}
          alt="Gamis hijau"
          width={350}
          quality={100}
          className="absolute right-20"
        />
      </div>
    </>
  );
}
