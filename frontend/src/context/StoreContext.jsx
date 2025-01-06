import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [billItems, setBillItems] = useState([]);
  const [food_list, setFoodList] = useState([]);
  const [tableNumber, setTableNumber] = useState(0);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/menuitems");
        setFoodList(response.data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };

    fetchFoodList();
  }, []);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product.productId === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const addItemToBill = () => {
    const itemsToAdd = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product.productId === item);
        itemsToAdd.push({
          ...itemInfo,
          quantity: cartItems[item],
          total: itemInfo.price * cartItems[item],
        });
      }
    }
    setBillItems((prevBillItems) => [...prevBillItems, ...itemsToAdd]);
  };

  const getTotalBillItems = async (tableNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/orders/?tableNumber=${tableNumber}&open=true`
      );
      const orders = response.data;
      return orders.length;
    } catch (error) {
      console.error("Error fetching bill items:", error);
      return 0;
    }
  };

  const clearCart = () => {
    setCartItems({});
  };

  const assignTableNumber = () => {
    tableNumber = 5;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    addItemToBill,
    getTotalBillItems,
    setBillItems,
    billItems,
    tableNumber,
    assignTableNumber,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
