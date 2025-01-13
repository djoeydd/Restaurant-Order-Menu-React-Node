import React, { useEffect, useState } from "react";
import "./BillDisplay.css";
import BillItem from "../BillItem/BillItem";
import axios from "axios";

const BillDisplay = ({ orders }) => {
  const [localOrders, setLocalOrders] = useState([]);

  useEffect(() => {
    const validOrders = orders.filter(
      (order) => order.items && order.items.length > 0
    );
    setLocalOrders(validOrders);
  }, [orders]);

  const handleItemDeleted = async (orderId, itemId) => {
    // Find the order we're working with
    const order = localOrders.find((order) => order._id === orderId);

    // Calculate what the items would be after deletion
    const updatedItems = order.items.filter((item) => item._id !== itemId);

    // If this would leave us with an empty order, confirm first
    if (updatedItems.length === 0) {
      const confirmDelete = window.confirm(
        "Deleting this item will remove the order. Continue?"
      );

      if (!confirmDelete) {
        return false; // Return false to indicate deletion was cancelled
      }

      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders/${orderId}`
        );
        setLocalOrders(localOrders.filter((order) => order._id !== orderId));
        return true; // Return true to indicate successful deletion
      } catch (error) {
        console.error(
          "Failed to delete order:",
          error.response ? error.response.data : error.message
        );
        return false; // Return false if deletion failed
      }
    } else {
      try {
        // Make API call to delete the item
        await axios.delete(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/orders/${orderId}/items/${itemId}`
        );

        // Only update state if API call was successful
        const updatedOrders = localOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: updatedItems,
              }
            : order
        );
        setLocalOrders(updatedOrders);
        return true; // Return true to indicate successful deletion
      } catch (error) {
        console.error(
          "Failed to delete item:",
          error.response ? error.response.data : error.message
        );
        return false; // Return false if deletion failed
      }
    }
  };

  const handleCloseOrder = (order) => async () => {
    const confirmClose = window.confirm("Closing order. Continue?");

    if (!confirmClose) {
      return false;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders/close/${
          order._id
        }`
      );
      order.open = false;
      setLocalOrders([...localOrders]);
      return true;
    } catch (error) {
      console.error("Failed to close order:", error);
      return false;
    }
  };

  const handleOpenOrder = (order) => async () => {
    const confirmOpen = window.confirm("Opening order. Continue?");

    if (!confirmOpen) {
      return false;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders/open/${
          order._id
        }`
      );
      order.open = true;
      setLocalOrders([...localOrders]);
      return true;
    } catch (error) {
      console.error("Failed to open order:", error);
      return false;
    }
  };

  return (
    <div className="admin-bill-display" id="admin-bill-display">
      <div className="admin-bill-display-list">
        {localOrders.map((order) => {
          if (!order.items || order.items.length === 0) {
            return null;
          }

          const total = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <div key={order._id} className="admin-order">
              <h3>Order Number: {order._id}</h3>
              <div className="admin-order-table-date">
                <p>Table Number: {order.tableNumber}</p>
                <p>Date: {new Date(order.date).toLocaleString()}</p>
                <p>Status: {order.open ? "Open" : "Closed"}</p>
              </div>
              <div className="admin-bill-item-list">
                {order.items.map((item) => (
                  <BillItem
                    key={item._id}
                    orderId={order._id}
                    itemId={item._id}
                    name={item.itemName}
                    price={item.price}
                    quantity={item.quantity}
                    onItemDeleted={handleItemDeleted}
                  />
                ))}
              </div>
              <h4>Total: ¥{total}</h4>
              {order.open ? (
                <div className="button-group">
                  <button id="close-button" onClick={handleCloseOrder(order)}>
                    Close Order
                  </button>
                  <button id="add-button">Add Item</button>
                </div>
              ) : (
                <button id="add-button" onClick={handleOpenOrder(order)}>
                  Open Order
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillDisplay;
