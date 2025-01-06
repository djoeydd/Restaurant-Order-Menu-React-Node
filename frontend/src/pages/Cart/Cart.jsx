import React, { useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    addItemToBill,
    tableNumber,
    getTotalBillItems,
  } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Define the isCartEmpty variable
  const isCartEmpty = Array.isArray(cartItems)
    ? cartItems.length === 0
    : Object.keys(cartItems).length === 0;

  const handlePlaceOrder = async () => {
    if (isCartEmpty) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(true);

      // Prepare the order data
      const orderData = {
        items: food_list
          .filter((item) => cartItems[item.productId] > 0)
          .map((item) => ({
            itemName: item.name,
            price: item.price,
            quantity: cartItems[item.productId],
          })),
        tableNumber: tableNumber,
      };

      try {
        const totalBillItems = await getTotalBillItems(tableNumber);

        let response;
        if (totalBillItems === 0) {
          // Make a POST request to create a new order
          response = await axios.post(
            "http://localhost:3000/api/orders",
            orderData
          );
        } else {
          // Make a PATCH request to add items to the existing order
          response = await axios.patch(
            `http://localhost:3000/api/orders/add/${tableNumber}`,
            { items: orderData.items }
          );
        }

        console.log("Order created successfully:", response.data);

        // Clear the cart and navigate to the main page
        setIsLoading(true); // Set loading state to true
        setTimeout(() => {
          clearCart(); // Clear the cart items
          navigate("/"); // Navigate to the main page
          setIsLoading(false); // Set loading state to false
        }, 2000);
      } catch (error) {
        console.error("Error processing order:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item.productId] > 0) {
            return (
              <div key={item.productId}>
                <div className="cart-items-title cart-items-item">
                  <img src={`src/assets/${item.image}`} alt="" />
                  <p>{item.name}</p>
                  <p>¥{item.price}</p>
                  <p className="quantity">{cartItems[item.productId]}</p>
                  <p>¥{item.price * cartItems[item.productId]}</p>
                  <p
                    onClick={() => removeFromCart(item.productId)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>¥{getTotalCartAmount()}</p>
          </div>
          <button onClick={handlePlaceOrder} disabled={isLoading}>
            {isLoading ? "Placing Order..." : "PLACE ORDER"}
          </button>
        </div>
        <div className="tbd"></div>
        <div className="tbd"></div>
      </div>
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner">
            {isCartEmpty ? "Cart is empty" : "Loading..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
