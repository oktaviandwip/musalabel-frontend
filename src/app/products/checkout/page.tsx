"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { clearSelectedItems, setOrders } from "@/store/reducer/order";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { updateAddress, updatePhoneNumber } from "@/store/reducer/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import noOrder from "@/assets/Shopping Cart.svg";

type AddressKey = "Address1" | "Address2" | "Address3";

export default function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile } = useSelector((state: RootState) => state.user);
  const { selectedItems } = useSelector((state: RootState) => state.order);
  const [deliveryOption, setDeliveryOption] = useState("Regular");
  const [selectedAddress, setSelectedAddress] = useState(
    profile?.Address1 || profile?.Address2 || profile?.Address3 || ""
  );
  const [localPhoneNumber, setLocalPhoneNumber] = useState(
    profile?.Phone_number || ""
  );
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<null | AddressKey>(null);
  const [updatedAddresses, setUpdatedAddresses] = useState({
    Address1: profile?.Address1 || "",
    Address2: profile?.Address2 || "",
    Address3: profile?.Address3 || "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(7000);

  useEffect(() => {
    const itemTotalPrice = selectedItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );
    setTotalPrice(itemTotalPrice + deliveryCost);
    const script = document.createElement("script");
    script.src = "https://js.xendit.co/v1/xendit.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [selectedItems, deliveryOption]);

  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.Quantity,
    0
  );

  const handleDeliveryOptionChange = (option: string) => {
    setDeliveryOption(option);
    let cost = 7000;
    if (option === "Cargo") cost = 5000;
    if (option === "Next Day") cost = 10000;
    if (option === "Same Day") cost = 14000;
    if (option === "Instant") cost = 20000;
    setDeliveryCost(cost);
  };

  const handlePayment = async () => {
    if (!profile?.Phone_number || !selectedAddress) {
      setErrorMessage("No. Telp dan Alamat tidak boleh kosong.");
      return;
    }

    const names = selectedItems.map((item) => item.Name).join(", ");

    const body = JSON.stringify({
      amount: totalPrice,
      payerEmail: profile?.Email,
      description: `Invoice for ${names} purchase`,
      successRedirectURL: "http://localhost:3000/products/orders/",
      failureRedirectURL: "https://example.com/payment-failure",
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );
      const { data } = await response.json();

      if (data.invoice_url) {
        const updateOrders = {
          id: selectedItems.map((item) => item.Id),
          status: "Belum Bayar",
          purchase_id: data.external_id,
          invoice_url: data.invoice_url,
          delivery_option: deliveryOption,
          delivery_address: selectedAddress,
          total_price: totalPrice,
        };

        const createOrder = {
          id: [""],
          user_id: profile?.Id,
          product_id: selectedItems[0].Product_id,
          quantity: selectedItems[0].Quantity,
          size: selectedItems[0].Size,
          status: "Belum Bayar",
          purchase_id: data.external_id,
          invoice_url: data.invoice_url,
          delivery_option: deliveryOption,
          delivery_address: selectedAddress,
          total_price: totalPrice,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              selectedItems[0].Id ? updateOrders : createOrder
            ),
          }
        );

        if (res.ok) {
          dispatch(clearSelectedItems());
          dispatch(setOrders([]));
          router.push("/products/orders/");
        }
      } else {
        console.error("Failed to get invoice URL");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleSelectedAddress = (addressKey: AddressKey) => {
    setSelectedAddress(updatedAddresses[addressKey]);
    setIsAddressOpen(false);
  };

  const handleEditAddress = (addressKey: AddressKey) => {
    setEditingAddress(addressKey);
  };

  const handleSaveAddress = async (addressKey: AddressKey) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/phone-address`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: profile?.Id,
            [addressKey]: updatedAddresses[addressKey],
          }),
        }
      );

      if (res.ok) {
        dispatch(
          updateAddress({
            addressKey,
            addressValue: updatedAddresses[addressKey],
          })
        );
        setEditingAddress(null);
      }
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleAddressInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    addressKey: AddressKey
  ) => {
    setUpdatedAddresses({
      ...updatedAddresses,
      [addressKey]: event.target.value,
    });
  };

  const handleSavePhone = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/phone-address`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: profile?.Id,
            Phone_number: localPhoneNumber,
          }),
        }
      );

      if (response.ok) {
        dispatch(updatePhoneNumber(localPhoneNumber));
        setIsPhoneOpen(false);
      } else {
        console.error("Failed to update phone number");
      }
    } catch (error) {
      console.error("Failed to update phone number:", error);
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
    <>
      <Header />
      <div className="container space-y-4 py-32 min-h-screen">
        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {errorMessage}
          </div>
        )}

        {selectedItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Image src={noOrder} alt="No orders" width={100} height={100} />
            <p className="text-gray-500 mt-4">Belum ada pesanan</p>
          </div>
        ) : (
          <>
            <Card className="p-4 space-y-2">
              <h2 className="text-xl font-bold">Detail Pembeli</h2>
              <p className="py-2">Nama: {profile?.Full_name}</p>
              <div className="flex items-center justify-between">
                <p>No. Telp: {profile?.Phone_number}</p>
                <Button
                  variant="secondary"
                  onClick={() => setIsPhoneOpen(true)}
                >
                  Ubah
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p>Alamat: {selectedAddress}</p>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddressOpen(true)}
                >
                  Ubah
                </Button>
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-4">Pilihan Produk</h2>
              {selectedItems.map((item) => (
                <div
                  key={`${item.Product_id}-${item.Size}`}
                  className="flex justify-between mb-2 items-center"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.Image}
                      alt={item.Name}
                      width={50}
                      height={50}
                      className="mr-4"
                    />
                    <span>
                      {item.Name} ({item.Size}) x {item.Quantity}
                    </span>
                  </div>
                  <span>{formatCurreny(item.Price * item.Quantity)}</span>
                </div>
              ))}
            </Card>
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-4">Pengiriman</h2>
              <div className="flex justify-between space-y-2">
                <Select
                  onValueChange={handleDeliveryOptionChange}
                  value={deliveryOption}
                >
                  <SelectTrigger className="max-w-44">
                    <SelectValue placeholder="Pilih Jasa Pengiriman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cargo">Cargo</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Next Day">Next Day</SelectItem>
                    <SelectItem value="Same Day">Same Day</SelectItem>
                    <SelectItem value="Instant">Instant</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  {deliveryOption === "Cargo"
                    ? formatCurreny(5000)
                    : deliveryOption === "Regular"
                    ? formatCurreny(7000)
                    : deliveryOption === "Next Day"
                    ? formatCurreny(10000)
                    : deliveryOption === "Same Day"
                    ? formatCurreny(14000)
                    : formatCurreny(20000)}
                </div>
              </div>
            </Card>
            <div className="flex justify-between px-4">
              <Button
                className="mt-4 bg-gradient text-white w-44"
                onClick={handlePayment}
              >
                Lanjut ke Pembayaran
              </Button>
              <div className="flex items-center space-x-6 mt-4">
                <p>Total Barang: {totalQuantity}</p>
                <p>
                  Total Harga:{" "}
                  <span className="text-destructive font-semibold">
                    {formatCurreny(totalPrice)}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Ganti Alamat</DialogTitle>
          <DialogDescription>
            Pilih atau edit alamat yang sudah ada
          </DialogDescription>
          <div className="space-y-4">
            {(["Address1", "Address2", "Address3"] as AddressKey[]).map(
              (addressKey, index) => (
                <div key={addressKey}>
                  <div className="font-bold">Alamat {index + 1}</div>
                  {editingAddress === addressKey ? (
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={updatedAddresses[addressKey]}
                        onChange={(event) =>
                          handleAddressInputChange(event, addressKey)
                        }
                        className="flex-1"
                      />
                      <Button onClick={() => handleSaveAddress(addressKey)}>
                        Simpan
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <p className="max-w-[334px] pr-4">
                        {updatedAddresses[addressKey] || "+ Tambah Alamat"}
                      </p>
                      <div className="flex">
                        <div
                          className="cursor-pointer hover:bg-secondary p-3 rounded-lg"
                          onClick={() => handleEditAddress(addressKey)}
                        >
                          <Icon icon="mage:edit-pen" />
                        </div>
                        <div
                          className="cursor-pointer hover:bg-secondary p-3 rounded-lg"
                          onClick={() => handleSelectedAddress(addressKey)}
                        >
                          <Icon icon="mage:check-square" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPhoneOpen} onOpenChange={setIsPhoneOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Ganti No. Telp</DialogTitle>
          <DialogDescription>
            Masukkan no. telp baru atau edit yang sudah ada
          </DialogDescription>
          <div className="space-y-4">
            <div className="flex space-x-2 mt-1">
              <Input
                value={localPhoneNumber}
                onChange={(e) => setLocalPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSavePhone}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
