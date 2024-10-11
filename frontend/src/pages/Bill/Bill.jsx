import React, { useEffect, useContext } from "react";
import "./Bill.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Bill = () => {
  const tableNumber = 5; // Assuming tableNumber is stored in context
  const { billItems, setBillItems } = useContext(StoreContext);

  useEffect(() => {
    const fetchBillItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/orders/?tableNumber=${tableNumber}&open=true`
        );
        setBillItems(response.data);
      } catch (error) {
        console.error("Error fetching bill items:", error);
      }
    };

    fetchBillItems();
  }, [tableNumber, setBillItems]);

  const closeOrders = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/orders/close/${tableNumber}`
      );
      setBillItems([]); // Clear the bill items after closing orders
    } catch (error) {
      console.error("Error closing orders:", error);
    }
  };

  return (
    <div className="bill">
      <h2>Order</h2>
      <div className="bill-items">
        <div className="bill-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <br />
        <hr />
        {billItems.length === 0 ? (
          <p>No items in the bill.</p>
        ) : (
          billItems.map((order) =>
            order.items.map((item, index) => (
              <div key={`${order.productId}-${index}`}>
                <div className="bill-items-title bill-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.itemName}</p>
                  <p>¥{item.price}</p>
                  <p>{item.quantity}</p>
                  <p>¥{item.price * item.quantity}</p>
                </div>
                <hr />
              </div>
            ))
          )
        )}
      </div>
      <div className="bill-bottom">
        <div className="bill-total">
          <h2>Bill Total</h2>
          <hr />
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
          <button onClick={closeOrders}>Request Bill</button>
        </div>
        <div className="tbd"></div>
        <div className="tbd"></div>
      </div>
    </div>
  );
};

export default Bill;
