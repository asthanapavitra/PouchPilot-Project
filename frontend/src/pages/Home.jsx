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
            "Watches",
          ],
        },
        {
          name: "Gifts For Him",
          productsType: [
            "Accessories",
            "Art of Living",
            "Jewellery",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Watches",
          ],
        },
        {
          name: "Gifts For Couples",
          productsType: [
            "Accessories",
            "Art of Living",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Jewellery",
          ],
        },
        {
          name: "Gifts For Babies",
          productsType: [
            "Accessories",
            "Art of Living",
            "Leather Goods",
            "Ready to Wear",
          ],
        },
        { name: "All Gifts", productsType: [] },
        { name: "Personalisation" },
      ],
    },
    {
      name: "New",
      subcategories: [
        {
          name: "For Women",
          productsType: [
            "Accessories",
            "Art of Living",
            "Jewellery",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Watches",
          ],
        },
        {
          name: "For Men",
          productsType: [
            "Accessories",
            "Art of Living",
            "Jewellery",
            "Leather Goods",
            "Perfumes",
            "Shoes",
            "Watches",
          ],
        },

        { name: "Personalisation" },
      ],
    },
    {
      name: "Bags",
      subcategories: [
        {
          name: "Women Bags",
          productsType: [
            "STARPHENOM Icons",
            "All Handbags",
            "Crossbody bags",
            "Shoulder bags ",
            "Tote bags",
            "Mini bags",
            "Hobo bags",
            "Bucket bags",
            "Backpacks",
            "Top Handlers ",
            "Shoulder Straps",
          ],
        },
        {
          name: "Men Bags",
          productsType: [
            "STARPHENOM Icons",
            "All Handbags",
            "Crossbody bags",
            "Backpacks",
            "Bumbags",
            "Tote bags",
            "Mini bags",
            "Backpacks",
          ],
        },
        {
          name: "Women Small Leather Goods",
          productsType: [
            "All Wallets and Small Leather Goods",
            "Wallets on Chain and Micro Bags",
            "STARPHENOM Essentials",
            "Compact and Long Wallets",
            "Card Holders and Key Holders",
            "Newness",
          ],
        },
        {
          name: "Men Small Leather Goods",
          productsType: [
            "Compact Wallets",
            "Card Holders",
            "Long Wallets",
            "Mini Bags",
            "Passport Covers",
            "Pouches",
          ],
        },
        { name: "Personalisation" },
      ],
    },
    {
      name: "Men",
      subcategories: [
        {
          name: "Bags",
          productsType: [
            "STARPHENOM Icons",
            "All Handbags",
            "Crossbody bags",
            "Backpacks",
            "Bumbags",
            "Tote bags",
            "Mini bags",
            "Backpacks",
          ],
        },
        {
          name: "Wallets and Small Leather Goods",
          productsType: [
            "Compact Wallets",
            "Card Holders",
            "Long Wallets",
            "Mini Bags",
            "Passport Covers",
            "Pouches",
          ],
        },
        {
          name: "Travel",
          productsType: [
            "Rolling Luggage",
            "Travel Bags",
            "Travel Accessories",
          ],
        },
        { name: "Accessories", productsType: [] },
        {
          name: "Fashion Jewellery",
          productsType: [
            "Bracelets",
            "Rings",
            "Monogram and Leather Bracelets",
            "Brooches",
          ],
        },
        {
          name: "Shoes",
          productsType: [
            "All Shoes",
            "Sneakers",
            "Loafers and Moccasins",
            "Sandals",
            "Lace-ups and Buckles shoes",
            "Boots",
          ],
        },
        { name: "Ready-to-Wear", productsType: [] },
        { name: "Watches", productsType: [] },
      ],
    },
    {
      name: "Women",
      subcategories: [
        {
          name: "Handbags",
          productsType: [
            "STARPHENOM Icons",
            "All Handbags",
            "Crossbody bags",
            "Shoulder bags ",
            "Tote bags",
            "Mini bags",
            "Hobo bags",
            "Bucket bags",
            "Backpacks",
            "Top Handlers ",
            "Shoulder Straps",
          ],
        },
        {
          name: "Wallets and Small Leather Goods",
          productsType: [
            "All Wallets and Small Leather Goods",
            "Wallets on Chain and Micro Bags",
            "STARPHENOM Essentials",
            "Compact and Long Wallets",
            "Card Holders and Key Holders",
            "Newness",
          ],
        },
        {
          name: "Fashion Jewellery",
          productsType: [
            "Necklaces and Pendants",
            "Bracelets",
            "Earrings",
            "Rings",
            "Monogram and Leather Bracelets",
            "Brooches",
          ],
        },
        {
          name: "Shoes",
          productsType: [
            "All Shoes",
            "Sneakers",
            "Boots and Ankle Boots",
            "Loafers and Ballerinas",
            "Platform Shoes",
            "Mules and Slides",
            "Sandals and Espadrilles",
            "Pumps",
          ],
        },
        { name: "Accessories", productsType: [] },
        { name: "Ready-to-Wear", productsType: [] },
        {
          name: "Travel",
          productsType: [
            "Rolling Luggage",
            "Travel Bags",
            "Travel Accessories",
          ],
        },
        { name: "Watches", productsType: [] },
      ],
    },
    {
      name: "Watches",
      subcategories: [
        { name: "All Watches", productsType: [] },
        {
          name: "Watches Collections",
          productsType: [
            "Escale",
            "Tambour",
            "Tambour Convergence",
            "Tambour Taiko",
            "Original Tambour",
            "Objects of Time",
          ],
        },
        { name: "Personalisation" },
      ],
    },
    {
      name: "Travel And Home",
      subcategories: [
        {
          name: "Travel Bags and Rolling Luggage",
          productsType: [
            "Rolling Luggage",
            "Travel Bags",
            "Travel Accessories",
          ],
        },
        {
          name: "Home and Art of Dining",
          productsType: [
            "Furniture",
            "Decoration",
            "Art of Dining",
            "Home Textile",
          ],
        },
        {
          name: "Books and Stationery",
          productsType: [
            "All Books and Stationery",
            "Hardcover Books",
            "City Guides",
            "Travel Books",
            "Fashion Eye Books",
            "Office and Writing",
          ],
        },
        {
          name: "High-Tech Objects and Accessories",
          productsType: [
            "Audio and Connected Watches Accessories",
            "Smartphone Accessories",
          ],
        },
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
        { name: "Personalisation" },
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
        { name: "Personalisation" },
      ],
    },
    {
      name: "Services",
      subcategories: [
        { name: "Personalisation" },
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
