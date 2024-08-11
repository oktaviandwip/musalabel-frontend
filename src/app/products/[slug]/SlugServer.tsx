import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import ProductDetails from "./SlugClient";

interface ProductData {
  Id: string;
  Name: string;
  Slug: string;
  Description: string;
  Price: number;
  Image: string[];
  Stock: number;
  Size: string[];
  Created_at: string;
  Updated_at: string | null;
}

async function getProduct(slug: string): Promise<ProductData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`
    );

    if (!res.ok) {
      console.error("Failed to fetch the product data");
      return null;
    }

    const { data } = await res.json();
    data.Image = data.Image.split(",");
    data.Size = data.Size.split(",");
    return data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function Server({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);

  if (!data) return <p>Error loading product data</p>;

  return (
    <div className="container flex flex-col sm:flex-row p-4 pt-20 min-h-screen mb-10">
      {/* Carousel for Product Images */}
      <Carousel className="sm:w-1/3">
        <CarouselContent>
          {data.Image.map((url, i) => (
            <CarouselItem key={i}>
              <Image
                src={url}
                alt={`Product Image ${i + 1}`}
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Product Details */}
      <div className="sm:w-2/3 p-4 sm:ml-10 text-justify sm:text-left mt-10">
        <h1 className="text-2xl font-bold mb-2">{data.Name}</h1>
        <p className="mb-4 text-primary">{data.Description}</p>
        <h1 className="text-destructive">{formatter.format(data.Price)}</h1>
        <p className="mb-4 text-gray-400">Stok: {data.Stock}</p>

        <ProductDetails data={data} />
      </div>
    </div>
  );
}
