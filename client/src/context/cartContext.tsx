import {createContext, useState, useEffect, useContext, ReactNode } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    action: "increase" | "decrease"
  ) => Promise<void>;
  deleteItem: (cartItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const API_BASE_URL = "http://localhost:8080/api/v1/cart";

  // ✅ Fetch user cart
  const fetchCart = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/getCart`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setCart(data.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    }
  };

  // ✅ Add item to cart
  const addToCart = async (productId: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/createCart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
      } else {
        console.error("Add to cart failed:", data.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // ✅ Update quantity (handles both increase & decrease)
  const updateQuantity = async (
    productId: string,
    action: "increase" | "decrease"
  ): Promise<void> => {
    const item = cart.find((i) => i.productId._id === productId);
    if (!item) return;

    let newQty = item.quantity;
    if (action === "increase") newQty += 1;
    if (action === "decrease") newQty -= 1;

    if (newQty <= 0) {
      return deleteItem(item._id); // reuse delete function
    }

    try {
      const res = await fetch(`${API_BASE_URL}/updateCartItem/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQty }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchCart();
      } else {
        console.error("Update quantity failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ✅ Delete item
  const deleteItem = async (cartItemId: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/deleteCartItem/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        await fetchCart();
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateQuantity, deleteItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};
