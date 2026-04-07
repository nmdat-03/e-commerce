"use client";

import { useState } from "react";

type FlyItem = {
  id: string;
  image: string;
  start: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  end: {
    top: number;
    left: number;
  };
};

export const useFlyToCart = () => {
  const [flyingItems, setFlyingItems] = useState<any[]>([]);

  const triggerFly = (item: FlyItem) => {
    setFlyingItems((prev) => [...prev, item]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));
    }, 800);
  };

  return { flyingItems, triggerFly };
};
