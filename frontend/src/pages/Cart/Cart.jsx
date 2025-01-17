import React, { useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Cart = () => {
  const {
    cartItems,
    food_list,
    decreaseQuantity,
    getTotalCartAmount,
    clearCart,
    removeItemFromCart,
    addToCart,
    increaseQuantity,
    addItemToBill,
    tableNumber,
    getTotalBillItems,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
            image: item.image,
            quantity: cartItems[item.productId],
          })),
        tableNumber: tableNumber,
      };
      console.log("Order data:", orderData);

      try {
        const totalBillItems = await getTotalBillItems(tableNumber);

        let response;
        if (totalBillItems === 0) {
          // Make a POST request to create a new order
          response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders`,
            orderData
          );
        } else {
          // Make a PATCH request to add items to the existing order

          response = await axios.patch(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_URL
            }/api/orders/add/${tableNumber}`,
            { items: orderData.items }
          );
        }

        console.log("Order created successfully:", response.data);

        // Clear the cart and navigate to the main page
        setIsLoading(true);
        setTimeout(() => {
          clearCart();
          navigate("/"); // Navigate to the main page
          setIsLoading(false);
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
        <hr />
        <br />
        <h2>Order</h2>
        {food_list.map((item, index) => {
          if (cartItems[item.productId] > 0) {
            return (
              <div key={item.productId}>
                <div className="single-item-container">
                  <div className="item-image">
                    <img src={`src/assets/${item.image}`} alt="" />
                  </div>
                  <div className="item-text-description">
                    <h4>{item.name}</h4>
                    <p>¥{item.price * cartItems[item.productId]}</p>
                    <div className="quantity-container">
                      <div className="item-button-group">
                        <button
                          className="minus-button"
                          onClick={() => decreaseQuantity(item.productId)}
                        >
                          -
                        </button>
                        <p>{cartItems[item.productId]}</p>
                        <button
                          className="plus-button"
                          onClick={() => increaseQuantity(item.productId)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeItemFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <div className="cart-total-details">
            <p>Total:</p>
            <p>¥{getTotalCartAmount()}</p>
          </div>
          <button onClick={handlePlaceOrder} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner text={"Placing Order"} />
            ) : (
              "Place Order"
            )}
          </button>
        </div>
        {isLoading && (
          <div>
            {isCartEmpty ? (
              "Cart is empty"
            ) : (
              <LoadingSpinner text={"Placing Order"} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
