import React, { useRef } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Home = () => {
  const [category, setCategory] = React.useState("All");
  const foodDisplayRef = useRef(null);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (foodDisplayRef.current) {
      foodDisplayRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="main-container">
      <Header />
      <h1 ref={foodDisplayRef}>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring traditional and modern Mexican
        options
      </p>
      <div className="explore-container">
        <ExploreMenu category={category} setCategory={handleCategoryChange} />

        <hr />
      </div>
      <div>
        <FoodDisplay category={category} />
      </div>
    </div>
  );
};

export default Home;
