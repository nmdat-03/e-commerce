"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { createOrder } from "@/server/actions/order";
import { useRouter } from "next/navigation";
import { Edit, Loader2, MapPinHouse, MapPinPlus, Phone, Trash2 } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { deleteAddress, updateAddress } from "@/server/actions/address";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

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

const AddressForm = dynamic(() => import("@/components/address/AddressForm"), { ssr: false });

export default function CheckoutClient({ initialAddresses }: Props) {
    const { isSignedIn } = useUser();
    const { items, removeSelectedItems } = useCart();

    const selectedItems = useMemo(
        () => items.filter((item) => item.selected),
        [items]
    );

    const selectedTotal = useMemo(() => {
        return selectedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }, [selectedItems]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState(initialAddresses);

    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const selectedAddress = addresses.find(
        (a) => a.id === selectedAddressId
    );

    const router = useRouter();

    useEffect(() => {
        const defaultAddress = initialAddresses.find((a) => a.isDefault);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
        }
    }, [initialAddresses]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (!target.closest(".address-dropdown")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    /*----------------------------------------*/
    /*              HANDLE DELETE             */
    /*----------------------------------------*/
    const handleDelete = async (id: string) => {
        await deleteAddress(id);

        setAddresses((prev) => {
            const newList = prev.filter((a) => a.id !== id);

            if (selectedAddressId === id && newList.length > 0) {
                setSelectedAddressId(newList[0].id);
            }

            return newList;
        });
    };

    /*----------------------------------------*/
    /*              HANDLE EDIT               */
    /*----------------------------------------*/
    const handleEdit = async (id: string, data: Partial<Address>) => {
        const updated = await updateAddress(id, data);

        setAddresses((prev) =>
            prev.map((a) => (a.id === id ? updated : a))
        );
    };

    /*----------------------------------------*/
    /*           HANDLE SET DEFAULT           */
    /*----------------------------------------*/
    const handleSetDefault = async (id: string) => {
        const updated = await updateAddress(id, { setDefault: true });

        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                isDefault: a.id === updated.id,
            }))
        );

        setSelectedAddressId(updated.id);
    };

    /*----------------------------------------*/
    /*           HANDLE PLACE ORDER           */
    /*----------------------------------------*/
    const handlePlaceOrder = async () => {
        if (!isSignedIn) {
            alert("Please sign in first");
            return;
        }

        if (loading) return;

        if (selectedItems.length === 0) {
            alert("No items selected");
            return;
        }

        const selectedAddress = addresses.find(
            (a) => a.id === selectedAddressId
        );

        if (!selectedAddress) {
            alert("Please select an address");
            return;
        }

        setLoading(true);

        try {
            const order = await createOrder({
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                address: selectedAddress.address,
                productIds: selectedItems.map((item) => item.productId),
            });

            removeSelectedItems();

            router.push(`/order/success?orderId=${order.id}`);
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    /*=======================================*/
    /*              COMPONENTS               */
    /*=======================================*/
    if (selectedItems.length === 0) {
        return (
            <div className="container py-10 text-center">
                No items selected
            </div>
        );
    }

    return (
        <div className="container py-10 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* ========== LEFT ========== */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
                <h2 className="text-xl font-bold">Shipping Address</h2>
                {!isSignedIn ? (
                    <div className="text-center space-y-4">
                        <p>Please sign in to select address</p>
                        <SignInButton mode="modal" forceRedirectUrl="/checkout">
                            <button className="bg-black text-white px-4 py-2 rounded-lg">
                                Login
                            </button>
                        </SignInButton>
                    </div>
                ) : addresses.length === 0 ? (
                    <>
                        <p className="text-sm text-gray-500">
                            No address found. Please add one.
                        </p>

                        <button
                            onClick={() => {
                                setFormMode("add");
                                setEditingAddress(null);
                            }}
                            className="text-sm border border-gray-500 text-gray-500 px-2 py-1 rounded-md flex gap-1 items-center"
                        >
                            <MapPinPlus size={14} />
                            Add new address
                        </button>

                        {formMode === "add" && (
                            <AddressForm
                                onSuccess={(newAddr) => {
                                    setAddresses((prev) => [...prev, newAddr]);
                                    setSelectedAddressId(newAddr.id);
                                    setFormMode(null);
                                }}
                                onCancel={() => setFormMode(null)}
                            />
                        )}
                    </>
                ) : (
                    <div className="space-y-3 relative address-dropdown">
                        {/* SELECTED ADDRESS */}
                        {selectedAddress && (
                            <div className="border p-3 rounded-lg space-y-3">
                                <div
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="space-y-2 cursor-pointer"
                                >
                                    <p className="font-medium">{selectedAddress.fullName}</p>

                                    <p className="text-sm flex gap-2 items-center">
                                        <Phone size={14} />
                                        {selectedAddress.phone}
                                    </p>

                                    <p className="text-sm flex gap-2 items-start">
                                        <MapPinHouse size={14} className="mt-1 shrink-0" />
                                        <span className="wrap-break-word">
                                            {selectedAddress.address}
                                        </span>
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        {selectedAddress.isDefault ? (
                                            <span className="text-xs text-green-600 border border-green-600 px-2 py-1 rounded-md">
                                                Default
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSetDefault(selectedAddress.id);
                                                }}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Set as default
                                            </button>
                                        )}

                                        <span className="text-xs text-blue-600">
                                            Change address
                                        </span>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => {
                                            setFormMode("edit");
                                            setEditingAddress(selectedAddress);
                                        }}
                                        className="flex items-center gap-1 text-blue-600 border border-blue-600 px-2 py-1 text-xs rounded-md"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedAddress.id)}
                                        className="flex items-center gap-1 text-red-600 border border-red-600 px-2 py-1 text-xs rounded-md"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* DROPDOWN */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full bg-white border rounded-lg shadow-lg overflow-hidden"
                                >
                                    <div className="max-h-40 overflow-y-auto p-3 space-y-3">
                                        {addresses
                                            .filter((a) => a.id !== selectedAddressId)
                                            .map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => {
                                                        setSelectedAddressId(addr.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="space-y-2 border p-3 rounded-lg cursor-pointer hover:border-black transition"
                                                >
                                                    <p className="text-sm">
                                                        <span className="font-semibold">{addr.fullName}</span> | {addr.phone}
                                                    </p>
                                                    <p className="text-sm flex gap-1 items-start">
                                                        <MapPinHouse size={14} className="mt-1 shrink-0" />
                                                        <span className="wrap-break-word">
                                                            {addr.address}
                                                        </span>
                                                    </p>
                                                    {addr.isDefault && (
                                                        <span className="text-xs text-green-600 border border-green-600 px-2 py-1 rounded-md">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ADD NEW */}
                        <button
                            onClick={() => {
                                setFormMode("add");
                                setEditingAddress(null);
                                setIsOpen(false);
                            }}
                            className="w-full text-sm border border-gray-400 text-gray-500 py-2 rounded-lg flex items-center justify-center gap-1"
                        >
                            <MapPinPlus size={14} />
                            Add new address
                        </button>

                        {/* FORM ADD */}
                        {formMode === "add" && (
                            <AddressForm
                                onSuccess={(newAddr) => {
                                    setAddresses((prev) => [...prev, newAddr]);
                                    setSelectedAddressId(newAddr.id);
                                    setFormMode(null);
                                }}
                                onCancel={() => setFormMode(null)}
                            />
                        )}

                        {/* FORM EDIT */}
                        {formMode === "edit" && editingAddress && (
                            <AddressForm
                                initialData={editingAddress}
                                onSuccess={(updated) => {
                                    handleEdit(editingAddress.id, updated);
                                    setFormMode(null);
                                    setEditingAddress(null);
                                }}
                                onCancel={() => {
                                    setFormMode(null);
                                    setEditingAddress(null);
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* ========== RIGHT ==========*/}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6 sticky top-5 h-fit">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-3">
                    {selectedItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border p-3 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={item.image || "/no-image.png"}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover"
                                />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        x{item.quantity}
                                    </p>
                                </div>
                            </div>

                            <p className="font-semibold">
                                ${item.price * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${selectedTotal}</span>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {loading ? "Processing..." : "Place Order"}
                </button>
            </div>
        </div >
    );
}
