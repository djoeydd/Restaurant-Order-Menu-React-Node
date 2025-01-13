import React, { useEffect, useContext, useState } from "react";
import "./Bill.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Bill = () => {
  const { tableNumber, resetTableNumber } = useContext(StoreContext);
  const { billItems, setBillItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isOrderEmpty = Array.isArray(billItems)
    ? billItems.length === 0
    : Object.keys(billItems).length === 0;

  useEffect(() => {
    const fetchBillItems = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/orders/?tableNumber=${tableNumber}&open=true`
        );
        setBillItems(response.data);
      } catch (error) {
        console.error("Error fetching bill items:", error);
      }
    };

    fetchBillItems();
  }, [tableNumber, setBillItems, billItems]);

  const closeOrders = async () => {
    if (isOrderEmpty) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(true);
      try {
        await axios.patch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders/close/${
            billItems[0]._id
          }`
        );
        setTimeout(() => {
          setBillItems([]); // Clear the bill items after closing orders
          navigate("/"); // Navigate to the main page
          resetTableNumber(); // Reset the table number and show the modal
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error processing order:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bill">
      <hr />
      <br />
      <h2>Bill</h2>
      <div className="bill-items">
        {billItems.length === 0 ? (
          <p>No items in the bill.</p>
        ) : (
          billItems.map((order) =>
            order.items.map((item, index) => (
              <div key={`${order.productId}-${index}`}>
                <div className="single-bill-item-container">
                  <div className="bill-item-image">
                    <img src={`src/assets/${item.image}`} alt="" />
                  </div>
                  <div className="bill-item-text-description">
                    <h4>{item.itemName}</h4>
                    <p id="bill-item-quantity">
                      ¥{item.price} x {item.quantity}
                    </p>
                    <p>¥{item.price * item.quantity}</p>
                    <div className="bill-quantity-container"></div>
                  </div>
                </div>
                <hr />
              </div>
            ))
          )
        )}
      </div>
      <div className="bill-bottom">
        <div className="bill-total">
          <div className="bill-total-details">
            <p>Total</p>
            <p>
              ¥
              {billItems.reduce(
                (acc, order) =>
                  acc +
                  order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ),
                0
              )}
            </p>
          </div>
          <button onClick={closeOrders} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner text={"Requesting Bill"} />
            ) : (
              "Request Bill"
            )}
          </button>
        </div>
        {isLoading && (
          <div>
            {isOrderEmpty ? (
              "No items in bill"
            ) : (
              <LoadingSpinner text={"Requesting Bill"} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bill;
