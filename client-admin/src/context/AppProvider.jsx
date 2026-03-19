// src/context/AppProvider.jsx
import { useState, useMemo } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalMenu, setOriginalMenu] = useState([]);
  const [menu, setMenu] = useState([
    /*
    {
      id: 1,
      name: "Krunchy cheesy fries",
      image: "uploads/krunchycheesyfries",
      target: "/",
      price: 61,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 2,
      name: "Thon krunchy special",
      image: "uploads/thonkrunchyspecial",
      target: "/",
      price: 49,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 3,
      name: "Burger crispy medium",
      image: "uploads/burgercrispymedium",
      target: "/",
      price: 56,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 4,
      name: "Sandwitch poulet grille",
      image: "uploads/sandwitchpouletgrille",
      target: "/",
      price: 54,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 5,
      name: "Salade krunchy thon",
      image: "uploads/saladkrunchython",
      target: "/",
      price: 58,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 6,
      name: "Burger crispy king",
      image: "uploads/burgercrispyking",
      target: "/",
      price: 67,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 7,
      name: "Salade crispy",
      image: "uploads/saladecrispy",
      target: "/",
      price: 67,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 8,
      name: "Burrito crispy",
      image: "uploads/burritocrispy",
      target: "/",
      price: 59,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 9,
      name: "Krunchy star",
      image: "uploads/krunchystar",
      target: "/",
      price: 64,
      prep_time: 25,
      category: "Dish",
    },
    {
      id: 10,
      name: "Pepsi zero sugar 33cl",
      image: "uploads/krunchycheesyfries",
      price: 10,
      category: "Drink",
    },
    {
      id: 11,
      name: "Pepsi 33cl",
      image: "uploads/thonkrunchyspecial",
      price: 10,
      category: "Drink",
    },
    {
      id: 12,
      name: "Cocacola 25cl",
      image: "uploads/burgercrispymedium",
      price: 10,
      category: "Drink",
    },
    {
      id: 13,
      name: "Sprite 25cl",
      image: "uploads/sandwitchpouletgrille",
      price: 10,
      category: "Drink",
    },
    {
      id: 14,
      name: "Hawai 25cl",
      image: "uploads/saladkrunchython",
      price: 10,
      category: "Drink",
    },
    {
      id: 15,
      name: "Poms 25cl",
      image: "uploads/burgercrispyking",
      price: 10,
      category: "Drink",
    },
    {
      id: 16,
      name: "7 up 25cl",
      image: "uploads/saladecrispy",
      price: 10,
      category: "Drink",
    },
    {
      id: 17,
      name: "Pepsi zero sugar 33cl",
      image: "uploads/krunchycheesyfries",
      price: 10,
      category: "Drink",
    },
    {
      id: 18,
      name: "Fries",
      image: "uploads/krunchycheesyfries",
      price: 10,
      category: "Extra",
    },*/
  ]);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      menu,
      setMenu,
      originalMenu,
      setOriginalMenu,
    }),
    [orders, loading, menu, originalMenu],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
