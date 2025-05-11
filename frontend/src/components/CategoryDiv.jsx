import React from 'react'
import VideoContentCard from './VideoContentCard';
import ProductsCard from './ProductsCard';
import TwoVideoCard from './TwoVideoCard';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
const CategoryDiv = (props) => {
    const [products,setProducts]=useState([]);
    
  
    useEffect(()=>{
        async function fetchProducts(){
            try{
                let response=await axios.get(`${import.meta.env.VITE_BASE_URL}/products/get-products-by-category/${props.category}`,{
                   
                })
                if(response.status===200){
                    setProducts(response.data.products.slice(0,4));

                }
            }catch(err){
                console.log(err);
            }
        }
        fetchProducts();
       
    },[products])
  return (
    
        <div className="h-full w-full" key={props.index}>
          <div className="w-full h-full">
            {/* Video Section */}
            <VideoContentCard align={props.index%2==0?"left":"right"}
              videoSrc={"/videoplayback.mp4"}
              highlight={{
                heading: "Discover the Latest Trends",
                description:
                  "Explore our exclusive collection of fashion and lifestyle products.",
              }}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-10">
            {products.length>0 && products.map((product,index)=>{
              return ( <ProductsCard product={product} key={index} />)
              

            })}
              
             
            </div>
          </div>
          {props.isTwoDiv==="true"?<TwoVideoCard videoSrc={"/videoplayback.mp4"}/>:""}
        </div>
      
  )
}

export default CategoryDiv;