// Client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  updateItemInCart,
  setOrders,
} from "@/store/reducer/order";
import { RootState } from "@/store";
import { toast } from "@/components/ui/use-toast";

type ProductData = {
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
};

const handleToast = (type: "success" | "error", desc: string) => {
  toast({
    description: desc,
    className: `${
      type === "success"
        ? "bg-secondary text-primary"
        : "bg-destructive text-white"
    } fixed top-0 flex items-center justify-center inset-x-0 p-4 border-none rounded-none`,
  });
};

export default function ProductDetails({ data }: { data: ProductData }) {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { items } = useSelector((state: RootState) => state.order);
  const { profile } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const increaseQuantity = () => {
    if (quantity < data.Stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (selectedSize) {
      const orderData = {
        user_id: profile?.Id,
        product_id: data.Id,
        quantity,
        size: selectedSize,
        status: "cart",
      };

      try {
        const existingItemIndex = items.findIndex(
          (item) => item.Product_id === data.Id && item.Size === selectedSize
        );

        if (existingItemIndex !== -1) {
          const updatedItem = {
            ...items[existingItemIndex],
            Quantity: items[existingItemIndex].Quantity + quantity,
          };

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/orders/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedItem),
            }
          );

          if (res.ok) {
            dispatch(updateItemInCart(updatedItem));
          } else {
            console.error("Failed to update item in cart");
          }
        } else {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/orders/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderData),
            }
          );

          if (res.ok) {
            const result = await res.json();
            dispatch(
              addItemToCart({
                Id: result.data.Id,
                Product_id: data.Id,
                User_id: profile?.Id,
                Quantity: quantity,
                Size: selectedSize,
                Name: data.Name,
                Slug: data.Slug,
                Description: data.Description,
                Price: data.Price,
                Image: data.Image[0],
                Stock: data.Stock,
                Created_at: data.Created_at,
                Updated_at: data.Updated_at,
              })
            );
          } else {
            console.error("Failed to add order to cart");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      handleToast("error", "Pilih ukuran yang diinginkan");
    }
  };

  const handleBuyNow = () => {
    if (selectedSize) {
      const selectedItem = {
        Id: "",
        Product_id: data.Id,
        User_id: profile?.Id,
        Quantity: quantity,
        Size: selectedSize,
        Name: data.Name,
        Slug: data.Slug,
        Description: data.Description,
        Price: data.Price,
        Image: data.Image[0],
        Stock: data.Stock,
        Created_at: data.Created_at,
        Updated_at: data.Updated_at,
      };
      dispatch(setOrders([selectedItem]));
      router.push("/products/checkout");
    } else {
      handleToast("error", "Pilih ukuran yang diinginkan");
    }
  };

  return (
    <div>
      {/* Size Selection */}
      <div className="mb-4">
        <div className="mb-2">Ukuran</div>
        <div className="flex gap-2">
          {data.Size.map((s) => (
            <Button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`${
                selectedSize === s
                  ? "bg-primary text-white hover:text-white"
                  : "bg-secondary text-primary hover:text-white"
              }`}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Quantity Adjustment */}
      <div className="flex items-center mb-4 space-x-9">
        <p>Jumlah</p>
        <div>
          <Button
            onClick={decreaseQuantity}
            variant="secondary"
            className="size-8 text-xl rounded-none"
          >
            -
          </Button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="text-center w-12 h-8 border-2 border-secondary pt-[2px]"
          />
          <Button
            onClick={increaseQuantity}
            variant="secondary"
            className="size-8 text-xl rounded-none"
          >
            +
          </Button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleAddToCart}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          <span className="hidden sm:flex">Tambah ke&nbsp;</span>Keranjang
        </Button>
        <Button
          onClick={handleBuyNow}
          className="bg-gradient text-white px-4 py-2 rounded hover:bg-destructive hover:opacity-95"
        >
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
}
