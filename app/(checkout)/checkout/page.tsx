import CheckoutClient from "./CheckoutClient";
import { getAddresses } from "@/server/actions/address";

export default async function CheckoutPage() {
    const addresses = await getAddresses();

    return <CheckoutClient initialAddresses={addresses} />;
}