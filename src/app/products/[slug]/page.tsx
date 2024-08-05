"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  updateItemInCart,
  setOrders,
} from "@/store/reducer/order"; // Adjust path if necessary
import { RootState } from "@/store"; // Adjust path if necessary

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

export default function Details() {
  const [data, setData] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1); // State for product quantity
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // State for selected size
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const { items, selectedItems } = useSelector(
    (state: RootState) => state.order
  );
  const { profile } = useSelector((state: RootState) => state.user);
  const router = useRouter(); // Use the router

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `http://localhost:8080/products/details/${slug}`
        );
        if (res.ok) {
          const { data } = await res.json();
          data.Image = data.Image.split(",");
          data.Size = data.Size.split(",");
          setData(data);
        } else {
          console.error("Failed to fetch the product data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchProduct();
  }, [slug]);

  // Increase Quantity
  const increaseQuantity = () => {
    if (data && quantity < data.Stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrease Quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (selectedSize && data) {
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
          console.log(items[existingItemIndex]);
          // Update quantity of existing item
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
            console.log("Order updated in cart:", await res.json());
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
            console.log("Order added to cart:", result);

            // Add new item to cart
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
      console.error("No size selected or data is missing");
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (selectedSize && data) {
      console.log(`Purchasing ${quantity} items of size ${selectedSize}`);

      // Add selected item to selectedItems
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
      console.error("No size selected");
    }
  };

  // Price Format
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  if (!data) return null;

  return (
    <div>
      <Header />
      <div className="flex p-4 pt-20">
        {/* Carousel for Product Images */}
        <Carousel className="w-1/3">
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
        <div className="w-2/3 p-4 ml-10">
          <h1 className="text-2xl font-bold mb-2">{data.Name}</h1>
          <p className="mb-4 text-primary text-opacity-70">
            {data.Description}
          </p>
          <h1 className="text-gradient">{formatter.format(data.Price)}</h1>
          <p className="mb-4 text-gray-400">Stok: {data.Stock}</p>

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
              Tambah ke Keranjang
            </Button>
            <Button
              onClick={handleBuyNow}
              className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive hover:opacity-95"
            >
              Beli Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
