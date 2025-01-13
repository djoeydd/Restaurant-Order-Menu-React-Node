import { createContext, useState, useEffect } from "react";
import axios from "axios";
import TableNumberModal from "../components/TableNumberModal/TableNumberModal";
import { useLocation } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : {};
  });
  const [billItems, setBillItems] = useState(() => {
    const savedBillItems = localStorage.getItem("billItems");
    return savedBillItems ? JSON.parse(savedBillItems) : [];
  });
  const [food_list, setFoodList] = useState([]);
  const [tableNumber, setTableNumber] = useState(() => {
    const savedTableNumber = localStorage.getItem("tableNumber");
    return savedTableNumber ? parseInt(savedTableNumber, 10) : 0;
  });
  const [showModal, setShowModal] = useState(true); // State to manage modal visibility

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/menuitems`
        );
        setFoodList(response.data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };

    fetchFoodList();
  }, []);

  useEffect(() => {
    if (tableNumber > 0) {
      localStorage.setItem("tableNumber", tableNumber);
      setShowModal(false);
      // Load cart items and bill items for the table number
      const savedCartItems = localStorage.getItem(`cartItems_${tableNumber}`);
      const savedBillItems = localStorage.getItem(`billItems_${tableNumber}`);
      setCartItems(savedCartItems ? JSON.parse(savedCartItems) : {});
      setBillItems(savedBillItems ? JSON.parse(savedBillItems) : []);
    } else {
      localStorage.removeItem("tableNumber");
    }
  }, [tableNumber]);

  useEffect(() => {
    if (tableNumber > 0) {
      localStorage.setItem(
        `cartItems_${tableNumber}`,
        JSON.stringify(cartItems)
      );
      localStorage.setItem(
        `billItems_${tableNumber}`,
        JSON.stringify(billItems)
      );
    }
  }, [cartItems, billItems, tableNumber]);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const decreaseQuantity = (itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      const { [itemId]: _, ...rest } = cartItems;
      setCartItems(rest);
    }
  };

  const removeItemFromCart = (itemId) => {
    const { [itemId]: _, ...rest } = cartItems;
    setCartItems(rest);
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
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/orders/?tableNumber=${tableNumber}&open=true`
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

  const handleSetTableNumber = (number) => {
    if (number > 0) {
      setTableNumber(number);
      setShowModal(false);
    }
  };

  const resetTableNumber = () => {
    setTableNumber(0);
    setShowModal(true);
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    decreaseQuantity,
    getTotalCartAmount,
    clearCart,
    addItemToBill,
    getTotalBillItems,
    setBillItems,
    increaseQuantity,
    removeItemFromCart,
    billItems,
    tableNumber,
    setTableNumber: handleSetTableNumber,
    resetTableNumber,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
      {!isAdminPath && showModal && (
        <TableNumberModal setTableNumber={handleSetTableNumber} />
      )}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
