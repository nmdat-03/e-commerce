import { useCartStore } from "@/store/cart-store";
import { useShallow } from "zustand/react/shallow";

export const useCart = () => {
  return useCartStore(
    useShallow((state) => ({
      items: state.items,
      addToCart: state.addToCart,
      removeFromCart: state.removeFromCart,
      increaseQuantity: state.increaseQuantity,
      decreaseQuantity: state.decreaseQuantity,
      clearCart: state.clearCart,
      removeSelectedItems: state.removeSelectedItems,
      toggleSelect: state.toggleSelect,
      toggleSelectAll: state.toggleSelectAll,
      totalPrice: state.getTotalPrice(),
      totalItems: state.getTotalItems(),
    })),
  );
};
