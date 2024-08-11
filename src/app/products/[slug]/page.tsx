// page.tsx (Server Component)
import ProductDetails from "./client"; // Import the client component

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

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);

  if (!data) return <p>Error loading product data</p>;

  return <ProductDetails data={data} />;
}
