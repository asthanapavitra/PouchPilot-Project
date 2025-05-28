import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminProductCard from "./AdminProductCard";
const AdminProductsPanel = ({
  selectedSubcategory,
  setExpandedCategory,
  setActiveView,
  setProduct,
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedSubcategory) return;
      try {
        let response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/products/get-products-by-subcategory/${selectedSubcategory}`,
          {}
        );

        if (response.status === 200) {
          // console.log(response.data.products)
          setProducts(response.data.products);
        }
      } catch (err) {
        console.log(err);
        products.length = 0;
        console.log("No products found for this subcategory");
      }
    }
    fetchProducts();
  }, [selectedSubcategory]);
  return (
    <div
      className="w-full p-4"
      onClick={() => {
        setExpandedCategory(null);
      }}
    >
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {selectedSubcategory} Products
        </h2>
        <button
          onClick={() => {
            setActiveView("add-product");
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add New Product
        </button>
      </div>
      <div className="text-gray-500 w-full">
        {products.length == 0 ? (
          <p>No products available in this category</p>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product, index) => {
              return (
                <AdminProductCard
                  product={product}
                  setProducts={setProducts}
                  setProduct={setProduct}
                  setActiveView={setActiveView}
                  key={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPanel;
