"use client";

import { useSelector, useDispatch } from "react-redux";
import CartItems from "./CartItems";
import type { RootState } from "@/store";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { setOrders } from "@/store/reducer/order";
import noOrder from "@/assets/Shopping Cart.svg";
import Image from "next/image";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.order);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const createItemId = (productId: string, size: string) =>
    `${productId}-${size}`;

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        items.map((item) => createItemId(item.Product_id, item.Size))
      );
    }
  };

  const handleSelectItem = (productId: string, size: string) => {
    const itemId = createItemId(productId, size);
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const selectedProducts = items.filter((item) =>
    selectedItems.includes(createItemId(item.Product_id, item.Size))
  );
  const totalSelectedProducts = selectedProducts.length;
  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + item.Price * item.Quantity,
    0
  );

  const handleCheckout = () => {
    dispatch(setOrders(selectedProducts));
    router.push("/products/checkout");
  };

  return (
    <>
      <Header />
      <div className="container p-4 space-y-4 pt-24 min-h-[82vh]">
        {items.length > 0 ? (
          <>
            <div className="sticky top-20 grid grid-cols-8 bg-white gap-4 p-4 text-center z-10">
              <div>
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={handleSelectAll}
                  className="size-6 bg-primary text-primary border-primary focus:ring-primary"
                />
              </div>
              <div>Product</div>
              <div>Name</div>
              <div>Size</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total Price</div>
              <div>Action</div>
            </div>
            <div>
              {items.map((item, index) => (
                <CartItems
                  key={index}
                  user_id={item.User_id}
                  product_id={item.Product_id}
                  image={item.Image}
                  name={item.Name}
                  size={item.Size}
                  price={item.Price}
                  quantity={item.Quantity}
                  slug={item.Slug}
                  isSelected={selectedItems.includes(
                    createItemId(item.Product_id, item.Size)
                  )}
                  onSelect={handleSelectItem}
                />
              ))}
            </div>
            <div className="sticky bottom-0 p-4 bg-white border rounded-lg w-full grid grid-cols-8 items-center gap-4">
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={handleSelectAll}
                  className="size-6"
                />
              </div>
              <div className="col-span-3 flex justify-center">
                Total Products: {totalSelectedProducts}
              </div>
              <div className="col-span-3 flex justify-center">
                Total Price:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(totalPrice)}
              </div>
              <div className="col-span-1 flex justify-center">
                <Button
                  className="bg-gradient text-white"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-32">
            <Image src={noOrder} alt="No orders" width={100} height={100} />
            <p>Belum ada pesanan.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
