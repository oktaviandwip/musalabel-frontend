"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Model {
  Id: number;
  Name: string;
  Price: number;
  Stock: number;
  Image: string;
  Slug: string;
}

interface ModelListClientProps {
  models: Model[];
}

const ModelListClient: React.FC<ModelListClientProps> = ({ models }) => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Corrected type definition

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return (
    <>
      {models.map((model, index) => {
        const imageUrls = model.Image.split(",");

        return (
          <Card
            key={model.Id}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push(`/products/${model.Slug}`)}
          >
            <CardHeader className="relative group">
              <Image
                src={hoveredIndex === index ? imageUrls[1] : imageUrls[0]}
                alt="Image"
                width={250}
                height={250}
              />
            </CardHeader>
            <CardContent className="space-y-1">
              <CardTitle className="title text-center sm:text-left flex h-10 items-center justify-center sm:justify-start">
                {model.Name}
              </CardTitle>
              <CardTitle className="price text-center sm:text-left text-destructive">
                {formatter.format(model.Price)}
              </CardTitle>
              <CardDescription className="stok text-center sm:text-left">
                Stok: {model.Stock}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default ModelListClient;
