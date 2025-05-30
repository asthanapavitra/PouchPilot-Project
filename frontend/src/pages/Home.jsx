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
        "Gifts For Her",
        "Gifts For Him",
        "Gifts For Couples",
        "Gifts For Babies",
        "Gifts For Pets",
        "All Gifts",
        "Personalisation",
      ],
    },
    {
      name: "New",
      subcategories: ["For Women", "For Men", "For Pets", "Personalisation"],
    },
    {
      name: "Bags",
      subcategories: [
        "Women Bags",
        "Men Bags",
        "Women Small Leather Goods",
        "Men Small Leather Goods",
        "Personalisation",
      ],
    },
    {
      name: "Men",
      subcategories: [
        "Bags",
        "Wallets and Small Leather Goods",
        "Travel",
        "Accessories",
        "Fashion Jewellery",
        "Shoes",
        "Ready-to-Wear",
      ],
    },
    {
      name: "Women",
      subcategories: [
        "Handbags",
        "Wallets and Small Leather Goods",
        "Fashion Jewellery",
        "Shoes",
        "Accessories",
        "Ready-to-Wear",
        "Travel",
      ],
    },

    {
      name: "Watches",
      subcategories: ["All Watches", "Watches Collections", "High Watchmaking"],
    },

    {
      name: "Travel And Home",
      subcategories: [
        "Travel Bags and Rolling Luggage",
        "Home and Art of Dining",
        "Books and Stationery",
        "High-Tech Objects and Accessories",
      ],
    },
    {
      name: "Hats",
      subcategories: [
        "Baseball Cap",
        "Gambler Hats",
        "ASCOT CAP",
        "Bowler Hat",
        "Beret",
        "Fedora",
        "Personalisation",
      ],
    },
    {
      name: "Perfumes",
      subcategories: [
        " Highlights",
        "Icons",
        "Collections",
        "Exceptional Creations",
        "World of Fragrances",
        "Personalisation",
      ],
    },
    {
      name: "Services",
      subcategories: ["Personalisation", "STARPHENOM Repairs"],
    },

    // {
    //   name: "Merchandise",
    //   subcategories: ["Hoodies", "Stickers", "Posters"],
    // },
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
            {["S", "T", "A", "R", " "].map((char, index) => (
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
