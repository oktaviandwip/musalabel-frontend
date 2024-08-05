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
          >
            <CardHeader className="relative group">
              <Image
                src={hoveredIndex === index ? imageUrls[1] : imageUrls[0]}
                alt="Image"
                width={250}
                height={250}
                onClick={() => router.push(`/products/${model.Slug}`)}
              />
            </CardHeader>
            <CardContent className="space-y-1">
              <CardTitle className="title">{model.Name}</CardTitle>
              <CardTitle className="price text-destructive">
                {formatter.format(model.Price)}
              </CardTitle>
              <CardDescription className="stok">
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
