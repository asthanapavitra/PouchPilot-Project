import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import HomeCategoriesSection from "../components/HomeCategoriesSection";
import Footer from "../components/Footer";

import CategoryDiv from "../components/CategoryDiv";
import { useContext } from "react";
import { MobileResponsivenessContext } from "../context/MobileResponsiveness";

const Home = () => {
  const { isMobile } = useContext(MobileResponsivenessContext);
  const [logoPage, setLogoPage] = useState(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    return !hasVisited;
  });

  // Splash animation (only runs if logoPage is true)
  useGSAP(() => {
    if (!logoPage) return;

    const timeline = gsap.timeline();
    timeline.to(".logo-container", {
      scale: 1.1,
      duration: 1.2,
      ease: "power2.out",
    });

    timeline.fromTo(
      ".text-animation span",
      { opacity: 0 },
      { opacity: 1, stagger: 0.15, duration: 1 },
      0
    );

    timeline.to(
      {},
      {
        duration: 1,
        onComplete: () => {
          sessionStorage.setItem("hasVisited", "true"); // Mark as visited
          setLogoPage(false);
        },
      }
    );
  }, []);

  const categories = [
    {
      name: "Gifts",
      subcategories: [
        {
          name: "Gifts For Her",
          productsType: [
            "Accessories",
            "Art of Living",
            "Jewellery",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Watches"
          ],
        },
        { name: "Gifts For Him", productsType: [
            "Accessories",
            "Art of Living",
            "Jewellery",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Watches"
          ],},
        { name: "Gifts For Couples", productsType: [
            "Accessories",
            "Art of Living",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Jewellery",
          ]},
        { name: "Gifts For Babies", productsType: [
            "Accessories",
            "Art of Living",
            "Leather Goods",
            "Ready to Wear"
          ]},
        { name: "All Gifts", productsType: [] },
        { name: "Personalisation", productsType: [] },
      ],
    },
    {
      name: "New",
      subcategories: [
        { name: "For Women", productsType: [] },
        { name: "For Men", productsType: [] },
        { name: "For Pets", productsType: [] },
        { name: "Personalisation", productsType: [] },
      ],
    },
    {
      name: "Bags",
      subcategories: [
        { name: "Women Bags", productsType: [] },
        { name: "Men Bags", productsType: [] },
        { name: "Women Small Leather Goods", productsType: [] },
        { name: "Men Small Leather Goods", productsType: [] },
        { name: "Personalisation", productsType: [] },
      ],
    },
    {
      name: "Men",
      subcategories: [
        { name: "Bags", productsType: [] },
        { name: "Wallets and Small Leather Goods", productsType: [] },
        { name: "Travel", productsType: [] },
        { name: "Accessories", productsType: [] },
        { name: "Fashion Jewellery", productsType: [] },
        { name: "Shoes", productsType: [] },
        { name: "Ready-to-Wear", productsType: [] },
      ],
    },
    {
      name: "Women",
      subcategories: [
        { name: "Handbags", productsType: [] },
        { name: "Wallets and Small Leather Goods", productsType: [] },
        { name: "Fashion Jewellery", productsType: [] },
        { name: "Shoes", productsType: [] },
        { name: "Accessories", productsType: [] },
        { name: "Ready-to-Wear", productsType: [] },
        { name: "Travel", productsType: [] },
      ],
    },
    {
      name: "Watches",
      subcategories: [
        { name: "All Watches", productsType: [] },
        { name: "Watches Collections", productsType: [] },
        { name: "High Watchmaking", productsType: [] },
      ],
    },
    {
      name: "Travel And Home",
      subcategories: [
        { name: "Travel Bags and Rolling Luggage", productsType: [] },
        { name: "Home and Art of Dining", productsType: [] },
        { name: "Books and Stationery", productsType: [] },
        { name: "High-Tech Objects and Accessories", productsType: [] },
      ],
    },
    {
      name: "Hats",
      subcategories: [
        { name: "Baseball Cap", productsType: [] },
        { name: "Gambler Hats", productsType: [] },
        { name: "ASCOT CAP", productsType: [] },
        { name: "Bowler Hat", productsType: [] },
        { name: "Beret", productsType: [] },
        { name: "Fedora", productsType: [] },
        { name: "Personalisation", productsType: [] },
      ],
    },
    {
      name: "Perfumes",
      subcategories: [
        { name: "Highlights", productsType: [] },
        { name: "Icons", productsType: [] },
        { name: "Collections", productsType: [] },
        { name: "Exceptional Creations", productsType: [] },
        { name: "World of Fragrances", productsType: [] },
        { name: "Personalisation", productsType: [] },
      ],
    },
    {
      name: "Services",
      subcategories: [
        { name: "Personalisation", productsType: [] },
        { name: "STARPHENOM Repairs", productsType: [] },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden overflow-y-auto">
      {/* Splash Screen */}
      {logoPage && (
        <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-white flex flex-col justify-center items-center logo-container">
          <img
            className="h-75 w-75 -mb-10"
            src="/logo.jpg"
            alt="logo"
            style={{ transformOrigin: "center" }}
          />
          <h2 className="text-2xl text-animation">
            {["S", "T", "A", "R"].map((char, index) => (
              <span key={index} className={char === " " ? "mx-1" : ""}>
                {char}
              </span>
            ))}
            {["P", "A", "S", "S", "I", "O", "N"].map((char, index) => (
              <span
                key={index}
                className={`${char === " " ? "mx-1" : ""} font-extrabold`}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>
      )}

      {/* Search Panel */}

      {/* Main Content */}
      {!logoPage && (
        <>
          <Navbar logoPage={logoPage} isHomePage="true" isMobile={isMobile} />
          <div className=" w-screen pt-[65px]">
            <div className=" relative h-full w-full flex flex-col items-center justify-center gap-4 home-page">
              <HomeCategoriesSection categories={categories} />
              <CategoryDiv
                category={"Bags"}
                categories={categories}
                isTwoDiv="true"
                isMobile={isMobile}
                index={0}
              />
              <CategoryDiv
                category={"Watches"}
                categories={categories}
                isTwoDiv="false"
                isMobile={isMobile}
                index={1}
              />
              <Footer />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
