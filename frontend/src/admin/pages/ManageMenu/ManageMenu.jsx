import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageMenu.css";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    productId: "",
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/menuItems");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for duplicate productId
    const duplicate = menuItems.find(
      (item) => item.productId === newMenuItem.productId
    );
    if (duplicate) {
      setError("Product ID already exists. Please use a different Product ID.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/menuItems",
        newMenuItem
      );
      setMenuItems((prev) => [...prev, response.data]);
      setNewMenuItem({
        productId: "",
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
      setAddModal(false);
      setError("");
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Check for duplicate productId
    const duplicate = menuItems.find(
      (item) =>
        item.productId === editMenuItem.productId &&
        item._id !== editMenuItem._id
    );
    if (duplicate) {
      setError("Product ID already exists. Please use a different Product ID.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/menuItems/${editMenuItem._id}`,
        editMenuItem
      );
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === editMenuItem._id ? response.data : item
        )
      );
      setEditMenuItem(null);
      setEditModal(false);
      setError("");
    } catch (error) {
      console.error("Error editing menu item:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log("deleting");
      await axios.delete(`http://localhost:3000/api/menuItems/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleEdit = (id) => {
    const item = menuItems.find((item) => item._id === id);
    setEditMenuItem(item);
    setEditModal(true);
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div className="manage-menu">
      <h1>Manage Menu</h1>
      <button onClick={() => setAddModal(true)}>Add Menu Item</button>
      {categories.map((category) => (
        <div key={category} className="menu-category">
          <h2>{category}</h2>
          <div className="menu-items-list">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item._id} className="menu-item">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>Price: ¥{item.price}</p>
                  <p>Product ID: {item.productId}</p>
                  <div className="button-group">
                    <button
                      id="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                    <button
                      id="edit-button"
                      onClick={() => handleEdit(item._id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button className="add-button" onClick={() => setAddModal(true)}>
            Add {category}
          </button>
        </div>
      ))}
      {addModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setAddModal(false)}>
              &times;
            </span>
            <h2>Add Menu Item</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>
                Product ID:
                <input
                  type="text"
                  name="productId"
                  value={newMenuItem.productId}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newMenuItem.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={newMenuItem.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={newMenuItem.price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={newMenuItem.image}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={newMenuItem.category}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Add Menu Item</button>
            </form>
          </div>
        </div>
      )}
      {editModal && editMenuItem && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModal(false)}>
              &times;
            </span>
            <h2>Edit Menu Item</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleEditSubmit}>
              <label>
                Product ID:
                <input
                  type="text"
                  name="productId"
                  value={editMenuItem.productId}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editMenuItem.name}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={editMenuItem.description}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={editMenuItem.price}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={editMenuItem.image}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={editMenuItem.category}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
