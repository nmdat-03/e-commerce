"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/server/actions/order";
import { useRouter } from "next/navigation";
import AddressSection from "@/components/checkout/AddressSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

type Address = {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    isDefault: boolean;
};

type Props = {
    initialAddresses: Address[];
};

export default function CheckoutClient({ initialAddresses }: Props) {
    const { items, removeSelectedItems } = useCart();
    const router = useRouter();

    const selectedItems = useMemo(
        () => items.filter((item) => item.selected),
        [items]
    );

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (loading) return;

        if (!selectedAddress) {
            alert("Please select an address");
            return;
        }

        if (selectedItems.length === 0) {
            alert("No items selected");
            return;
        }

        setLoading(true);

        try {
            const order = await createOrder({
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                address: selectedAddress.address,
                paymentMethod,
                items: selectedItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            if (paymentMethod === "COD") {
                removeSelectedItems();
                router.push(`/order/success?orderId=${order.id}`);
            } else {
                const res = await fetch("/api/vnpay/create-payment", {
                    method: "POST",
                    body: JSON.stringify({ orderId: order.id }),
                });

                const data = await res.json();
                window.location.href = data.url;
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="container py-6 text-center italic">
                No items selected
            </div>
        );
    }

    return (
        <div className="container space-y-3">
            {/* BACK BUTTON */}
            <CustomButton
                onClick={() => router.back()}
                className="text-sm px-4 py-2 rounded-full shadow-md bg-white flex items-center"
            >
                <ChevronLeft size={14} />
                Back
            </CustomButton>

            {/* CHECKOUT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div className="space-y-5">
                    <AddressSection
                        initialAddresses={initialAddresses}
                        onSelect={setSelectedAddress}
                    />

                    <PaymentMethod
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                    />
                </div>

                <OrderSummary
                    items={selectedItems}
                    loading={loading}
                    onPlaceOrder={handlePlaceOrder}
                />
            </div>
        </div>
    );
}