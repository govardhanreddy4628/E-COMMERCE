import { useState, useEffect } from "react";

interface StickyProps {
  STICKY_HEIGHT: number;
}

interface StickyState {
  isSticky: boolean;
}

const useSticky = ({ STICKY_HEIGHT }: StickyProps): StickyState => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const Sticky = () => {
    const scrollTop = window.scrollY;
    if (scrollTop >= STICKY_HEIGHT) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", Sticky);
    return () => {
      window.removeEventListener("scroll", Sticky);
    };
  }, []);

  return { isSticky };
};

export default useSticky; 