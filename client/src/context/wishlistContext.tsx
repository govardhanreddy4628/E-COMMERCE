import { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface WishlistContextType {
  wishlist: string[]; // store product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const API_BASE_URL = "http://localhost:8080/api/v1/wishlist";

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getWishlist`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setWishlist(data.data.map((item: any) => item.productId));
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setWishlist([]);
    }
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/toggleWishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchWishlist();
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
