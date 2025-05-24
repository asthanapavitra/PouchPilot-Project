import React, { useEffect, useState } from "react";
import axios from  "axios"

import AdminProductCard from "./AdminProductCard";
const AdminProductsPanel = ({ selectedSubcategory, setExpandedCategory ,setActiveView}) => {
  const [products, setProducts] = useState([]);
const dummyProduct = {
  name: "AirRunner Sneakers",
  shortDescription: "Comfortable and stylish sneakers for everyday wear.",
  price: 3499,
  discount: 20,
  images: [
    {
      color: "Black",
      gallery: [
        "/backpack.jpeg","/barrel bag gucci.jpeg"
      ],
    },
    {
      color: "White",
      gallery: [
        "/cap.jpeg","/hoodie.jpeg"
      ],
    },
  ],
};

  useEffect(() => {
    async function fetchProducts() {
        console.log("Fetching products for subcategory:", selectedSubcategory);
      if (!selectedSubcategory) return;
      try {
        let response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/get-products-by-subcategory/${
            selectedSubcategory
          }`,
          {}
        );
        
        if (response.status === 200) {
            console.log(response.data.products)
          setProducts(response.data.products);
        }
        
      } catch (err) {
        console.log(err);
          products.length=0;
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
        <button onClick={()=>{setActiveView("add-product")}}
         className="bg-black text-white px-4 py-2 rounded">
          + Add New Product
        </button>
      </div>
      <div className="text-gray-500 w-full">
        {products.length==0?<p>No products available in this category</p>:
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product,index)=>
                    {return (
                         <AdminProductCard product={dummyProduct} key={index} />
                    )}
                )}
            </div>
        }
      </div>
    </div>
  );
};

export default AdminProductsPanel;
