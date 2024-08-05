"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import noOrder from "@/assets/Shopping Cart.svg";

interface OrderItem {
  Product_id: string;
  Quantity: number;
  Size: string;
  Name: string;
  Price: number;
  Image: string;
  Description: string;
}

interface Order {
  Purchase_id: string;
  items: OrderItem[];
  invoice_url: string;
  delivery_option: string;
  delivery_address: string;
  status: string;
  email: string;
  total_price: number;
}

const statusOptions = [
  "Semua",
  "Belum Bayar",
  "Sedang Dikemas",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
];

export default function Orders() {
  const { profile } = useSelector((state: RootState) => state.user);
  const [status, setStatus] = useState("Belum Bayar");
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    Semua: 0,
    "Belum Bayar": 0,
    "Sedang Dikemas": 0,
    Dikirim: 0,
    Selesai: 0,
    Dibatalkan: 0,
  });

  const fetchOrders = async (currentStatus: string) => {
    if (!profile?.Id) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase?email=${profile.Email}&status=${currentStatus}`
    );
    const data = await res.json();

    if (data.data) {
      const groupedOrders = data.data.reduce(
        (acc: Record<string, Order>, order: any) => {
          const {
            Purchase_id,
            Invoice_url,
            Delivery_option,
            Delivery_address,
            Status,
            Email,
            Total_price,
            ...item
          } = order;
          if (!acc[Purchase_id]) {
            acc[Purchase_id] = {
              Purchase_id,
              items: [],
              invoice_url: "",
              delivery_option: "",
              delivery_address: "",
              status: "",
              email: "",
              total_price: 0,
            };
          }
          acc[Purchase_id].items.push(item);
          acc[Purchase_id].invoice_url = Invoice_url;
          acc[Purchase_id].delivery_option = Delivery_option;
          acc[Purchase_id].delivery_address = Delivery_address;
          acc[Purchase_id].status = Status;
          acc[Purchase_id].email = Email;
          acc[Purchase_id].total_price = Total_price;
          return acc;
        },
        {}
      );
      setOrders(Object.values(groupedOrders));
    } else {
      setOrders([]);
    }
  };

  const fetchCount = async () => {
    if (!profile?.Id) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase-count?email=${profile.Email}`
    );
    const { data } = await res.json();
    setCounts(data);
  };

  useEffect(() => {
    if (profile?.Id) {
      fetchOrders(status);
      fetchCount();
    }
  }, [status, profile?.Id]);

  const handleCancelOrder = async (purchaseId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Dibatalkan",
            purchase_id: purchaseId,
          }),
        }
      );

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.Purchase_id !== purchaseId)
        );
        fetchCount();
      } else {
        console.error("Failed to cancel the order");
      }
    } catch (error) {
      console.error("Error cancelling the order:", error);
    }
  };

  const handleConfirmSending = async (purchaseId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Dikirim", purchase_id: purchaseId }),
        }
      );

      if (res.ok) {
        fetchOrders(status);
        fetchCount();
      } else {
        console.error("Failed to confirm sending the order");
      }
    } catch (error) {
      console.error("Error confirming sending:", error);
    }
  };

  const handleConfirmArrival = async (purchaseId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Selesai",
            purchase_id: purchaseId,
          }),
        }
      );

      if (res.ok) {
        fetchOrders(status);
        fetchCount();
      } else {
        console.error("Failed to confirm arrival of the order");
      }
    } catch (error) {
      console.error("Error confirming arrival:", error);
    }
  };

  const formatCurreny = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container pt-32">
      <div className="flex justify-around mb-8">
        {statusOptions.map((option: string) => (
          <button
            key={option}
            className={`relative px-4 py-2 ${
              status === option ? "text-destructive" : "text-gray-500"
            }`}
            onClick={() => setStatus(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
            {counts[option] > 0 && (
              <span className="absolute -top-1 -right-2 bg-destructive text-white text-s rounded-full size-6 flex items-center justify-center">
                {counts[option]}
              </span>
            )}
          </button>
        ))}
      </div>

      {orders.length > 0 ? (
        orders.map((order) => {
          return (
            <Card key={order.Purchase_id} className="p-4 mb-4">
              <div
                className={`${
                  profile?.Role !== "admin" ? "hidden" : "flex"
                } justify-between items-center`}
              >
                <span className="text-destructive text-sm">
                  <span className="text-primary">Email: </span>
                  {order.email}
                </span>
              </div>
              <div
                className={`${
                  status === "Semua" || status === "Dibatalkan"
                    ? "flex"
                    : "hidden"
                } justify-between items-center`}
              >
                <span className="text-destructive text-sm">
                  <span className="text-primary">Status: </span>
                  {order.status}
                </span>
              </div>
              {order.items.map((item) => (
                <div
                  key={item.Product_id}
                  className="flex justify-between my-4 items-center"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.Image}
                      alt={item.Name}
                      width={50}
                      height={50}
                      className="mr-4"
                      priority
                    />
                    <div>
                      <p>{item.Name}</p>
                      <p className="text-destructive">Size: {item.Size}</p>
                      <p>x {item.Quantity}</p>
                    </div>
                  </div>
                  <span>{formatCurreny(item.Price * item.Quantity)}</span>
                </div>
              ))}
              <div className="mt-4 ms-16 text-sm">
                <p>
                  <span className="text-gray-500">Alamat: </span>
                  <span>{order.delivery_address}</span>
                </p>
                <p>
                  <span className="text-gray-500">Pengiriman: </span>
                  <span>
                    {order.delivery_option +
                      " " +
                      (order.delivery_option === "Cargo"
                        ? `(${formatCurreny(5000)})`
                        : order.delivery_option === "Regular"
                        ? `(${formatCurreny(7000)})`
                        : order.delivery_option === "Next Day"
                        ? `(${formatCurreny(10000)})`
                        : order.delivery_option === "Same Day"
                        ? `(${formatCurreny(14000)})`
                        : `(${formatCurreny(20000)})`)}
                  </span>
                </p>
              </div>
              <div
                className={`flex ${
                  (status === "Belum Bayar" && profile?.Role !== "admin") ||
                  (status === "Sedang Dikemas" && profile?.Role === "admin") ||
                  (status === "Dikirim" && profile?.Role === "admin")
                    ? "justify-between"
                    : "justify-end"
                } items-center my-2`}
              >
                {status === "Belum Bayar" && profile?.Role !== "admin" && (
                  <div className="space-x-4">
                    <Button
                      className="mt-4 bg-gradient text-white"
                      onClick={() => (window.location.href = order.invoice_url)}
                    >
                      Bayar Sekarang
                    </Button>
                    <Button
                      className="mt-4 bg-secondary text-primary hover:bg-secondary hover:text-primary"
                      onClick={() => handleCancelOrder(order.Purchase_id)}
                    >
                      Batalkan
                    </Button>
                  </div>
                )}
                {status === "Sedang Dikemas" && profile?.Role === "admin" && (
                  <Button
                    className="mt-4 bg-secondary text-primary hover:bg-secondary hover:text-primary"
                    onClick={() => handleConfirmSending(order.Purchase_id)}
                  >
                    Konfirmasi Pengiriman
                  </Button>
                )}
                {status === "Dikirim" && profile?.Role === "admin" && (
                  <Button
                    className="mt-4 bg-secondary text-primary hover:bg-secondary hover:text-primary"
                    onClick={() => handleConfirmArrival(order.Purchase_id)}
                  >
                    Konfirmasi Sampai
                  </Button>
                )}
                <p className="flex items-center text-destructive font-bold mt-4 space-x-6">
                  <span className="text-primary font-normal">
                    Total Harga: &nbsp;
                  </span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(order.total_price)}
                </p>
              </div>
            </Card>
          );
        })
      ) : (
        <div className="flex flex-col justify-center items-center h-64">
          <Image src={noOrder} alt="No orders" width={100} height={100} />
          <p className="text-gray-500 mt-4">Belum ada pesanan</p>
        </div>
      )}
    </div>
  );
}
