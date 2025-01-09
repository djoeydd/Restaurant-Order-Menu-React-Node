// TableNumberModal.jsx
import React, { useState } from "react";
import "./TableNumberModal.css";

const TableNumberModal = ({ setTableNumber }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const tableNumber = parseInt(inputValue, 10);
    if (!isNaN(tableNumber) && tableNumber > 0) {
      setTableNumber(tableNumber);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Table Number</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Table Number:
            <input
              type="number"
              ref={(node) => node && node.focus()}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TableNumberModal;
