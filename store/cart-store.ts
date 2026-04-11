import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selected: boolean;
  stock?: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (
    item: Omit<CartItem, "id" | "quantity" | "selected"> & {
      id?: string;
      quantity?: number;
      selected?: boolean;
    },
  ) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeSelectedItems: () => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  updateItem: (item: { id: string; quantity: number; stock?: number }) => void;

  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /*------------------------------*/
      /*          ADD TO CART         */
      /*------------------------------*/
      addToCart: (item) => {
        const items = get().items;

        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          if (
            existing.stock !== undefined &&
            existing.quantity >= existing.stock
          ) {
            return;
          }

          const updatedItem = {
            ...existing,
            quantity: existing.quantity + 1,
            id: item.id || existing.id,
          };

          set({
            items: [
              updatedItem,
              ...items.filter((i) => i.productId !== item.productId),
            ],
          });
        } else {
          set({
            items: [
              {
                id: item.id || crypto.randomUUID(),
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity ?? 1,
                selected: item.selected ?? true,
                stock: item.stock,
              },
              ...items,
            ],
          });
        }
      },

      /*----------------------------------------------*/
      /*          SELECT ALL PRODUCTS IN CART         */
      /*----------------------------------------------*/
      toggleSelectAll: () =>
        set((state) => {
          if (state.items.length === 0) return state;
          const allSelected = state.items.every((i) => i.selected);
          return {
            items: state.items.map((item) => ({
              ...item,
              selected: !allSelected,
            })),
          };
        }),

      /*----------------------------------------------*/
      /*          SELECT SINGLE PRODUCT IN CART       */
      /*----------------------------------------------*/
      toggleSelect: (id: string) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item,
          ),
        })),

      /*------------------------------*/
      /*       REMOVE FROM CART       */
      /*------------------------------*/
      removeFromCart: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      /*-----------------------------------------------------*/
      /*       REMOVE SELECTED PRODUCTS AFTER CHECKOUT       */
      /*-----------------------------------------------------*/
      removeSelectedItems: () =>
        set((state) => ({
          items: state.items.filter((item) => !item.selected),
        })),

      /*------------------------------*/
      /*       INCREASE QUANTITY      */
      /*------------------------------*/
      increaseQuantity: (id) => {
        set({
          items: get().items.map((i) => {
            if (i.id !== id) return i;

            const nextQty = i.quantity + 1;

            if (i.stock !== undefined && nextQty > i.stock) {
              return i;
            }

            return { ...i, quantity: nextQty };
          }),
        });
      },

      /*------------------------------*/
      /*       DECREASE QUANTITY      */
      /*------------------------------*/
      decreaseQuantity: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: i.quantity > 1 ? i.quantity - 1 : 1,
                }
              : i,
          ),
        });
      },

      /*-----------------------*/
      /*       CLEAR CART      */
      /*-----------------------*/
      clearCart: () => set({ items: [] }),

      /*-----------------------*/
      /*       SET CART        */
      /*-----------------------*/
      setCart: (items) =>
        set({
          items: items.map((item) => ({
            ...item,
            quantity:
              item.stock !== undefined && item.quantity > item.stock
                ? item.stock
                : item.quantity,
            stock: item.stock,
          })),
        }),

      /*--------------------------*/
      /*       UPDATE ITEM        */
      /*--------------------------*/
      updateItem: (item: { id: string; quantity: number; stock?: number }) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: item.quantity,
                  stock: item.stock,
                }
              : i,
          ),
        })),

      /*------------------------*/
      /*       TOTAL PRICE      */
      /*------------------------*/
      getTotalPrice: () => {
        return get()
          .items.filter((item) => item.selected)
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      /*---------------------------*/
      /*       TOTAL PRODUCTS      */
      /*---------------------------*/
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // key localStorage
    },
  ),
);
