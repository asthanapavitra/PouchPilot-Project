import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductsCard from "../components/ProductsCard";

const SubCategoryProducts = () => {
  const [products, setProducts] = useState(null);
  const { subCategory } = useParams();

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
        console.log(err);
      }
    }

    if (!products) fetchProducts();
  }, [products, subCategory]);

  return (
    <div className="w-screen min-h-screen ">
      <Navbar />
      <div className="w-full h-full pt-[80px] px-6">
        <h2 className="text-3xl font-bold mb-3 capitalize">
          {subCategory} Products
        </h2>

        {!products ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
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
