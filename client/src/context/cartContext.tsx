import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./authContext"; // ✅ USE AUTH CONTEXT

const API_BASE_URL = "http://localhost:8080/api/v1/cart";

type CartItem = {
  quantity: number;
  cartItemId?: string;
  product?: any;
};

type CartMap = {
  [productId: string]: CartItem;
};

type CartContextType = {
  cart: CartMap;
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (productId: string, action: "inc" | "dec") => void;
  deleteItem: (productId: string) => void;
  mergeCartOnLogin: () => Promise<void>;
  getCartCount: number; // ✅ FIXED
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<CartMap>({});

  // ✅ GET AUTH STATE
  const { isAuthenticated } = useAuth();

  // 🔁 Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // 💾 Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =========================
  // ✅ ADD TO CART
  // =========================
  const addToCart = async (product: any, quantity: number = 1) => {
    const productId = product._id;
    const existing = cart[productId];

    const prevCart = cart; // ✅ for rollback

    const updatedCart: CartMap = {
      ...cart,
      [productId]: {
        ...existing,
        quantity: (existing?.quantity || 0) + quantity,
        product,
      },
    };

    setCart(updatedCart);

    // ❌ NOT LOGGED IN → only local
    if (!isAuthenticated) return;

    try {
      const res = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        setCart((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            cartItemId: data.cartItemId,
          },
        }));
      }
    } catch (err) {
      console.error("rollback add");
      setCart(prevCart); // ✅ FIXED rollback
    }
  };

  // =========================
  // ✅ UPDATE QUANTITY
  // =========================
  const updateQuantity = async (
    productId: string,
    action: "inc" | "dec"
  ) => {
    const item = cart[productId];
    if (!item) return;

    const newQty =
      action === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQty <= 0) return deleteItem(productId);

    const prevCart = cart;

    const updatedCart = {
      ...cart,
      [productId]: { ...item, quantity: newQty },
    };

    setCart(updatedCart);

    if (!isAuthenticated || !item.cartItemId) return;

    try {
      await fetch(
        `${API_BASE_URL}/updateCartItem/${item.cartItemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: newQty }),
        }
      );
    } catch {
      setCart(prevCart); // ✅ FIXED rollback
    }
  };

  // =========================
  // ✅ DELETE ITEM
  // =========================
  const deleteItem = async (productId: string) => {
    const item = cart[productId];

    const prevCart = cart;

    const updatedCart = { ...cart };
    delete updatedCart[productId];

    setCart(updatedCart);

    if (!isAuthenticated || !item?.cartItemId) return;

    try {
      await fetch(
        `${API_BASE_URL}/deleteCartItem/${item.cartItemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
    } catch {
      setCart(prevCart); // ✅ FIXED rollback
    }
  };

  // =========================
  // 🔥 MERGE CART ON LOGIN
  // =========================
  const mergeCartOnLogin = async () => {
    try {
      const localCart = Object.entries(cart).map(
        ([productId, item]) => ({
          productId,
          quantity: item.quantity,
        })
      );

      if (localCart.length === 0) return;

      const res = await fetch(`${API_BASE_URL}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: localCart }),
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const newCart: CartMap = {};

        data.data.forEach((item: any) => {
          newCart[item.productId._id] = {
            quantity: item.quantity,
            cartItemId: item._id,
            product: item.productId,
          };
        });

        setCart(newCart);
      }
    } catch (err) {
      console.error("merge failed", err);
    }
  };

  // =========================
  // 🧮 CART COUNT (FIXED)
  // =========================
  const getCartCount = useMemo(() => {
    return Object.values(cart).reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        deleteItem,
        mergeCartOnLogin,
        getCartCount, // ✅ FIXED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================
// ✅ HOOK
// =========================
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartContext missing");
  return ctx;
};
