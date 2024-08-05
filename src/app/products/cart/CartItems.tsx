"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { removeItemFromCart } from "@/store/reducer/order";
import { useRouter } from "next/navigation";

type CartItemCardProps = {
  user_id: string | undefined;
  product_id: string;
  image: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  slug: string;
  isSelected: boolean;
  onSelect: (productId: string, size: string) => void;
};

export default function CartItemCard({
  user_id,
  product_id,
  image,
  name,
  price,
  size,
  quantity,
  slug,
  isSelected,
  onSelect,
}: CartItemCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id, user_id, size }),
      });

      if (res.ok) {
        dispatch(removeItemFromCart({ Product_id: product_id, Size: size }));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalPrice = price * quantity;

  return (
    <Card className="grid grid-cols-8 gap-4 items-center p-4 border rounded-lg shadow-sm text-center hover:bg-secondary mt-4">
      <div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product_id, size)}
          onClick={(e) => e.stopPropagation()}
          className="size-6"
        />
      </div>

      <div
        className="flex items-center justify-center"
        onClick={() => router.push(`/products/${slug}`)}
      >
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className="rounded"
        />
      </div>
      <div className="text-lg" onClick={() => router.push(`/products/${slug}`)}>
        {name}
      </div>
      <div className="text-sm text-gray-600">{size}</div>
      <div className="text-sm">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(price)}
      </div>
      <div className="text-sm text-gray-600">{quantity}</div>
      <div className="text-sm font-bold text-destructive">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(totalPrice)}
      </div>
      <div className="flex justify-center">
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
