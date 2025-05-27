import React, { useState, useEffect } from "react";
import axios from 'axios';
import ProductsCard from "./ProductsCard";
const trendingSuggestions = ["Hoodie", "Sneakers", "Cap", "Watch"];

const SearchPanel = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
const[allProducts,setAllProducts]=useState([]);
  useEffect(() => {

    // Initially show random products
    async function fetchProducts(){
      try{
        let response=await axios.get(`${import.meta.env.VITE_BASE_URL}/products`)
        if(response.status==200){
          setAllProducts(response.data.products)
          const shuffled = [...response.data.products].sort(() => 0.5 - Math.random());
     
          setFilteredProducts(shuffled);
        }
       
      }catch(err){
        console.log(err);
    }
   
    }
    fetchProducts();
   
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen text-black px-6 w-full ">
      

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for products..."
        className="w-full p-3 bg-white-900 text-black border border-gray-700 rounded-xl outline-none mb-6"
      />

      {/* Trending Suggestions */}
      <div className="mb-6">
        <p className="mb-2 text-gray-400">Trending:</p>
        <div className="flex gap-3 flex-wrap">
          {trendingSuggestions.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSearch(word)}
              className="bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full ">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductsCard key={index} product={product}/>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Loading prooducts...
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
