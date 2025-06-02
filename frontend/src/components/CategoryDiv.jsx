import React from "react";
import VideoContentCard from "./VideoContentCard";
import ProductsCard from "./ProductsCard";
import TwoVideoCard from "./TwoVideoCard";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import CategoryCard from "./CategoryCard";
const CategoryDiv = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products/get-products-by-category/${
            props.category
          }`,
          {}
        );
        if (response.status === 200) {
          if (response.data.products.length > 8)
            setProducts(response.data.products.slice(0, 8));
          else setProducts(response.data.products);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (products.length == 0) fetchProducts();
  }, [products]);
  return (
    <div className="h-full w-full mb-4 " key={props.index}>
      <div className="w-[100%] h-full">
        {/* Video Section */}
        <VideoContentCard
          align={props.index % 2 == 0 ? "left" : "right"}
          videoSrc={props.videoSrc}
          isMobile={props.isMobile}
          highlight={props.highlight}
          category={props.category}
        />
        <h1 className="text-center mt-4 text-xl mb-4">Explore a Selections of the <span className="font-bold">STARPHENOM'</span> s Creations</h1> 
        <div className="grid grid-cols-2 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 row-gap-8 w-[90%] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 ">
          
          {props.categoriesAfterFirstVideo && props.categoriesAfterFirstVideo.map((cat, ind) => {
            return <CategoryCard category={cat} key={ind} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryDiv;
