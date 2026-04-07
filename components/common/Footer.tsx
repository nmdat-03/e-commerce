"use client";

import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

import instagramIcon from "@/public/icons/instagram.svg"
import facebookIcon from "@/public/icons/facebook.svg"
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-100 mt-16">
            <div className="container py-10 flex flex-col lg:flex-row lg:justify-between gap-8 text-sm">
                {/* Brand */}
                <div>
                    <h2 className="text-lg font-bold mb-3">MyStore</h2>
                    <p className="text-gray-600">
                        Simple e-commerce built with Next.js. Fast, clean, and modern.
                    </p>
                </div>

                <div className="flex flex-col gap-8 md:flex-row md:gap-40 md:justify-center">
                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold mb-3">Shop</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><Link href="/product">Product</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-3">Contact</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex gap-1 items-center"><Mail size={14} />Email: mystore@gmail.com</li>
                            <li className="flex gap-1 items-center"><PhoneCall size={14} />Phone: +84 123 456 789</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-3">Follow Us</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center gap-1"><Image src={facebookIcon} alt="facebook-icons" width={26} height={26}/>Facebook</li>
                            <li className="flex items-center gap-1"><Image src={instagramIcon} alt="instagram-icons" width={26} height={26}/>Instagram</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t py-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} MyStore. All rights reserved.
            </div>
        </footer>
    );
}