import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductsCard from "../components/ProductsCard";
import HomeCategoriesSection from "../components/HomeCategoriesSection";

const SubCategoryProducts = () => {
  const [products, setProducts] = useState(null);
  const { subCategory } = useParams();
  const location=useLocation();
const categories=location.state.categories
  useEffect(() => {
    async function fetchProducts() {
      try {
        let response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/products/get-products-by-subcategory/${subCategory}`
        );
        if (response.status === 200) {
          setProducts(response.data.products);
        }
      } catch (err) {
        if(err.status===404){
         
          setProducts([])
        }
        console.log(err);
      }
    }

    fetchProducts();
  }, [subCategory]);

  return (
    <div className="w-screen min-h-screen ">
      <Navbar />
      <div className="w-full h-full pt-[80px] px-6">
        <HomeCategoriesSection categories={categories}/>
        
        {products===null ? (
          <div className="text-center text-gray-500 text-lg mt-5">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-5">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {products.map((product,idx) => (
              <ProductsCard key={idx} product={product}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryProducts;
