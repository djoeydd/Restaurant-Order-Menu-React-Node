import React from "react";
import "./BillItem.css";

function BillItem({ orderId, itemId, name, price, quantity, onItemDeleted }) {
  const handleDelete = async () => {
    try {
      // Call parent's handleItemDeleted function and wait for the result
      const success = await onItemDeleted(orderId, itemId);

      // Only proceed if deletion was successful
      if (!success) {
        return;
      }
    } catch (error) {
      console.error(
        "Error in handleDelete:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="admin-bill">
      <div className="admin-bill-item">
        <p>{name}</p>
        <p>Price: ¥{price}</p>
        <p>Quantity: {quantity}</p>
      </div>
      <p onClick={handleDelete} className="admin-remove-bill">
        x
      </p>
    </div>
  );
}

export default BillItem;
