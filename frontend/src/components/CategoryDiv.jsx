import React from "react";
import VideoContentCard from "./VideoContentCard";
import ProductsCard from "./ProductsCard";
import TwoVideoCard from "./TwoVideoCard";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
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
          if(products.length>4)
            setProducts(response.data.products.slice(0, 4));
          else setProducts(response.data.products)
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (products.length == 0) fetchProducts();
  }, [products]);
  return (
    <div className="h-full w-full " key={props.index}>
      <div className="w-[100%] h-full">
        {/* Video Section */}
        <VideoContentCard
          align={props.index % 2 == 0 ? "left" : "right"}
          videoSrc={"/videoplayback.mp4"}
          isMobile={props.isMobile}
          highlight={{
            heading: "Discover the Latest Trends",
            description:
              "Explore our exclusive collection of fashion and lifestyle products.",
          }}
        />

        <div className="grid grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-[90%] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 ">
          {products.length > 0 ? (
            products.map((product, index) => {
              return <ProductsCard product={product} key={index} />;
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Loading products...
            </p>
          )}
        </div>
      </div>
      {props.isTwoDiv === "true" ? (
        <TwoVideoCard
          isMobile={props.isMobile}
          videoSrc={"/videoplayback.mp4"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default CategoryDiv;
