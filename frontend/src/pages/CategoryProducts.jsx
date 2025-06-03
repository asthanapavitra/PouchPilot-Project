import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductsCard from "../components/ProductsCard";
import HomeCategoriesSection from "../components/HomeCategoriesSection";
import { Menu } from "lucide-react";
import SubCateoryWiseProducts from "../components/SubCateoryWiseProducts";
const CategoryProducts = () => {
  const { category } = useParams();
  const location = useLocation();

  const categories = location.state.categories;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef();
  const [products, setProducts] = useState(null);
  useEffect(() => {
    async function getProductsByCategory() {
      try {
        let res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/products/get-Oneproduct-forType/${category}`
        );
        if (res.status == 200) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (products == null) getProductsByCategory();
  }, [products]);

  return (
    <div className="w-screen min-h-screen ">
      <Navbar />

      <div className="flex h-screen p-2 bg-gray-100 relative overflow-hidden">
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
                  <SubCateoryWiseProducts key={idx} product={product} />
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
