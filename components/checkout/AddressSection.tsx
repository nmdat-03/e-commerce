"use client";

import { useEffect, useState } from "react";
import { Edit, MapPinHouse, MapPinPlus, Phone, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { deleteAddress, updateAddress } from "@/server/actions/address";

type Address = {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    isDefault: boolean;
};

type Props = {
    initialAddresses: Address[];
    onSelect: (addr: Address) => void;
};

const AddressForm = dynamic(() => import("@/components/address/AddressForm"), {
    ssr: false,
});

export default function AddressSection({ initialAddresses, onSelect }: Props) {
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState(initialAddresses);
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isOpen, setIsOpen] = useState(false);


    const selectedAddress = addresses.find(
        (a) => a.id === selectedAddressId
    );

    const otherAddresses = addresses.filter(
        (a) => a.id !== selectedAddressId
    );

    /*----------------------------------------*/
    /*           DEFAULT ADDRESS              */
    /*----------------------------------------*/
    useEffect(() => {
        const defaultAddress = initialAddresses.find((a) => a.isDefault);
        if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            onSelect(defaultAddress);
        }
    }, [initialAddresses, onSelect]);

    /*----------------------------------------*/
    /*        CLICK OUTSIDE DROPDOWN          */
    /*----------------------------------------*/
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

        const newList = addresses.filter((a) => a.id !== id);
        setAddresses(newList);

        if (selectedAddressId === id && newList.length > 0) {
            const newSelected = newList[0];
            setSelectedAddressId(newSelected.id);
            onSelect(newSelected);
        }
    };

    /*----------------------------------------*/
    /*              HANDLE EDIT               */
    /*----------------------------------------*/
    const handleEdit = async (id: string, data: Partial<Address>) => {
        const updated = await updateAddress(id, data);

        setAddresses((prev) =>
            prev.map((a) => (a.id === id ? updated : a))
        );

        if (selectedAddressId === id) {
            onSelect(updated);
        }
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
        onSelect(updated);
    };

    /*=======================================*/
    /*                RENDER                 */
    /*=======================================*/
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6 address-dropdown">
            <h2 className="text-xl font-bold">Shipping Address</h2>

            {addresses.length === 0 ? (
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
                                onSelect(newAddr);
                                setFormMode(null);
                            }}
                            onCancel={() => setFormMode(null)}
                        />
                    )}
                </>
            ) : (
                <div className="space-y-3 relative">
                    {/* SELECTED ADDRESS */}
                    {selectedAddress && (
                        <div className="border border-gray-400 p-3 rounded-lg space-y-3">
                            <div
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="space-y-2 cursor-pointer"
                            >
                                <p className="font-medium">
                                    {selectedAddress.fullName}
                                </p>

                                <p className="text-sm flex gap-2 items-center">
                                    <Phone size={14} />
                                    {selectedAddress.phone}
                                </p>

                                <p className="text-sm flex gap-2 items-start">
                                    <MapPinHouse size={14} className="mt-1 shrink-0" />
                                    <span>{selectedAddress.address}</span>
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
                                    onClick={() =>
                                        handleDelete(selectedAddress.id)
                                    }
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
                                    {otherAddresses.length === 0 ? (
                                        <div className="text-sm text-gray-500 text-center py-2 italic">
                                            No other address
                                        </div>
                                    ) : (
                                        otherAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => {
                                                    setSelectedAddressId(addr.id);
                                                    onSelect(addr);
                                                    setIsOpen(false);
                                                }}
                                                className="space-y-2 border p-3 rounded-lg cursor-pointer hover:border-black transition"
                                            >
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        {addr.fullName}
                                                    </span>{" "}
                                                    | {addr.phone}
                                                </p>

                                                <p className="text-sm flex gap-1 items-start">
                                                    <MapPinHouse
                                                        size={14}
                                                        className="mt-1 shrink-0"
                                                    />
                                                    <span>{addr.address}</span>
                                                </p>

                                                {addr.isDefault && (
                                                    <span className="text-xs text-green-600 border border-green-600 px-2 py-1 rounded-md">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    )}
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
                                onSelect(newAddr);
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
    );


}
