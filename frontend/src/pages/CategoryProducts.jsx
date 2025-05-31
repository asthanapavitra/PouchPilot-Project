import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductsCard from "../components/ProductsCard";
import HomeCategoriesSection from "../components/HomeCategoriesSection";
import { Menu } from "lucide-react";
const CategoryProducts = () => {
  const { category } = useParams();
  const location = useLocation();

  const categories = location.state.categories;
  const subcategories = categories.find((cat) => cat.name == category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef();
  const [products, setProducts] = useState(null);

  async function handleSubCategoryClick(sub) {
    try {
      let response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/products/get-Oneproduct-forEach-subcategory/${sub}`
      );

      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } catch (err) {
      if (err.status === 404) {
        setProducts([]);
      }
      console.log(err);
    }
  }

  return (
    <div className="w-screen min-h-screen ">
      <Navbar />

      <div className="flex h-screen p-2 bg-gray-100 relative overflow-hidden">
        {/* <button
          className="absolute top-2 left-2 p-2 bg-white rounded-md lg:hidden z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button> */}

        {/* Backdrop for mobile */}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed lg:static top-0 left-0 z-40 h-full w-64 p-4 pt-[70px] bg-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:block`}
        >
          <div className="text-center mb-6">
            <img
              src={`https://picsum.photos/100`}
              alt="Admin"
              className="w-full  h-20  mb-2"
            />
            <h2 className="text-lg font-bold">{category}</h2>
          </div>
          <nav className="space-y-2 ">
            {subcategories.subcategories.map((sub, idx) => (
              <div key={idx} className="relative cursor-pointer">
                <p
                  onClick={() => {
                    setSelectedSubcategory(sub);
                    setSidebarOpen(false);
                    handleSubCategoryClick(sub);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100"
                >
                  {sub}
                </p>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main panel */}
        <main
          className="flex-1 overflow-y-auto pt-[70px] px-4 w-screen min-h-screen bg-gray-50"
          onClick={() =>
            window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false)
          } // click outside to close
        >
          <div className="w-full h-full">
            {products === null ? (
              <div className="text-center text-gray-500 text-lg mt-5">
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 text-lg mt-5">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 md:grid-cols-3  gap-6 w-full">
                {products.map((product, idx) => (
                  <ProductsCard key={idx} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryProducts;
