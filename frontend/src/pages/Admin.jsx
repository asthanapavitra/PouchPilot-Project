import AdminDashboard from "../components/AdminDashboard";
import AdminOrdersPage from "../components/AdminOrdersPage";
import AdminProductsPanel from "../components/AdminProductsPanel";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Clock3,
  LogOut,
  Package,
  Tags,
  Menu,
  Gift,
  Shirt,
  BarChart3,
  ShoppingBag,
  Watch,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MobileResponsivenessContext } from "../context/MobileResponsiveness";
import AddProductPanel from "../components/AddProductPanel";
import UpdateProductPanel from "../components/UpdateProductPanel";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Gifts",
    subcategories: [
      {
        name: "Gifts For Her",
        productsType: [
          "Accessories",
          "Art of Living",
          {
            name: "Jewellery",
            subTypes: [
              "Necklaces and Pendants",
              "Bracelets",
              "Earrings",
              "Rings",
              "Monogram and Leather Bracelets",
              "Brooches",
            ],
          },
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
          {
            name: "Jewellery",
            subTypes: [
              "All Fashion Jewellery",
              "Silver Fashion Jewellery",
              "Necklaces and Pendants",
              "Bracelets",
              "Rings",
              "Monogram and Leather Bracelets",
              "Brooches",
            ],
          },
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
          "Ready-to-Wear",
          {
            name: "Jewellery",
            subTypes: [
              "All Fashion Jewellery",
              "Silver Fashion Jewellery",
              "Necklaces and Pendants",
              "Bracelets",
              "Rings",
              "Monogram and Leather Bracelets",
              "Brooches",
            ],
          },
        ],
      },
      {
        name: "Gifts For Babies",
        productsType: [],
      },
      { name: "All Gifts", productsType: [] },
      { name: "Personalisation" },
    ],
  },

  {
    name: "Bags",
    subcategories: [
      {
        name: "Women Bags",
        productsType: [
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
          ,
          "Wallets on Chain and Micro Bags",

          "Compact Wallets",
          "Long Wallets",
          "Card Holders",
          "Passport Covers",
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
        productsType: ["Rolling Luggage", "Travel Bags", "Travel Accessories"],
      },
      { name: "Accessories", productsType: [] },
      {
        name: "Fashion Jewellery",
        productsType: [
          "All Fashion Jewellery",
          "Silver Fashion Jewellery",
          "Necklaces and Pendants",
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
        productsType: ["Rolling Luggage", "Travel Bags", "Travel Accessories"],
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
      {
        name: "High Watchmaking",
        productsType: [
          "Automata",
          " Poinçon De Genève",
          "Minute Repeater",
          " Spin Time",
          "Artistic Crafts",
          "Objects of Time",
          " Pocket Watches",
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
          "Personalisation",
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
      { name: "Icons", productsType: ["Spell On You", " Imagination"] },
      {
        name: "Collections",
        productsType: [
          "All Perfumes",
          "Feminine Perfumes",
          "Masculine Perfumes",
          "Cologne Perfumes",
          "Oriental Perfumes",
          "Les Extraits Collection",
          "Pure Perfumes: the Fine Art of Layering",
          "Travel",
        ],
      },
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

const Admin = () => {
  const { isMobile } = useContext(MobileResponsivenessContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  const [activeView, setActiveView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024 ? true : false
  );

  const sidebarRef = useRef();
  const [product, setProduct] = useState(null);
  const backdropRef = useRef();
  const navigate = useNavigate();
  useGSAP(() => {
    if (sidebarOpen) {
      gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(backdropRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: "-100%",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
      });
    }
  }, [sidebarOpen]);
  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (res.status === 200) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        alert("Logged out successfully");
      }
    } catch (err) {
      console.log(err);
      alert("An error occured while logging out, Please try again later ");
    }
  };
  const renderMainPanel = () => {
    if (activeView === "dashboard") return <AdminDashboard />;
    if (activeView === "orders") return <AdminOrdersPage />;
    if (activeView === "add-product")
      return (
        <AddProductPanel
          selectedSubCategory={selectedSubcategory}
          selectedCategory={selectedCategory}
          setActiveView={setActiveView}
          categories={categories}
        />
      );
    if (activeView === "update-product") {
      return (
        <UpdateProductPanel
          product={product}
          setProduct={setProduct}
          setActiveView={setActiveView}
        />
      );
    
    }
    if (activeView == "subCategoryProducts" && selectedSubcategory&& selectedProductType ) {
      return (
        <AdminProductsPanel
          setActiveView={setActiveView}
          selectedSubcategory={selectedSubcategory}
          setExpandedCategory={setExpandedCategory}
          selectedCategory={selectedCategory}
          selectedProductType={selectedProductType}
          product={product}
          setProduct={setProduct}

        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen p-2 relative ">
      <button
        className="absolute top-2 left-2 p-2 bg-white rounded-md shadow lg:hidden z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 p-4 bg-white transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0 lg:block`}
      >
        <div className="text-center mb-6">
          <img
            src="https://i.pravatar.cc/80"
            alt="Admin"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <h2 className="text-lg font-bold">Hey Admin</h2>
        </div>
        <nav className="space-y-2 ">
          <button
            onClick={() => {
              setActiveView("dashboard");
              setExpandedCategory(null);
              setSelectedSubcategory(null);
              window.innerWidth < 1024 && sidebarOpen &&setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-3 py-2 rounded hover:bg-gray-200 ${
              activeView === "dashboard" ? "bg-gray-200" : ""
            }`}
          >
            <BarChart3 className="mr-2" /> Dashboard
          </button>
          <button
            onClick={() => {
              setActiveView("orders");
              setExpandedCategory(null);
              setSelectedSubcategory(null);
              window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false);
            }}
            className={`flex items-center w-full px-3 py-2 rounded hover:bg-gray-200 ${
              activeView === "orders" ? "bg-gray-200" : ""
            }`}
          >
            <Clock3 className="mr-2" /> Orders
          </button>

          {categories.map((cat) => (
            <div key={cat.name} className="relative">
              <button
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setExpandedCategory(
                    expandedCategory === cat.name ? null : cat.name
                  );
                }}
                className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100"
              >
                {cat.icon} {cat.name}
              </button>

              {/* Subcategory Dropdown */}
              {expandedCategory === cat.name && (
                <div
                  className={`absolute ${
                    isMobile ? "left-32 w-60" : "left-64 w-72"
                  } top-0 transform transition-all duration-300 ease-out scale-100 opacity-100 translate-y-2 bg-white shadow-xl rounded-lg p-4 z-50 border border-gray-200`}
                >
                  <h3 className="text-md font-semibold mb-3 text-gray-800 border-b pb-1">
                    {cat.name}
                  </h3>

                  {cat.subcategories.map((sub) => (
                    <div key={sub.name} className="mb-2">
                      <button
                        onClick={() => {
                          setSelectedSubcategory(sub.name);
                          setExpandedSubcategory(
                            expandedSubcategory === sub.name ? null : sub.name
                          );
                        }}
                        className="block text-left w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded font-semibold"
                      >
                        {sub.name}
                      </button>

                      {/* Level 3 Product Types */}
                      {expandedSubcategory === sub.name && (
                        <div className="ml-4">
                          {sub.productsType.map((type) => {
                            // If it has subTypes => Level 4
                            if (type.subTypes) {
                              console.log("Subtypes");
                              return (
                                <div key={type.name} className="mb-1">
                                  <div className="text-gray-700 text-sm font-medium">
                                    {type.name}
                                  </div>
                                  <div className="ml-3">
                                    {type.subTypes.map((subType, i) => (
                                      <button
                                        key={i}
                                        onClick={() => {
                                          setSelectedProductType(
                                            `${type.name} > ${subType}`
                                          );
                                          setActiveView("subCategoryProducts");
                                          setExpandedCategory(null);
                                          window.innerWidth<=768 &&sidebarOpen && setSidebarOpen(false);
                                        }}
                                        className="block text-left w-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                      >
                                        {subType}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            // Else, simple product type
                            return (
                              <button
                                key={type}
                                onClick={() => {
                                  setSelectedProductType(type);
                                  setActiveView("subCategoryProducts");
                                  setExpandedCategory(null);
                                  window.innerWidth<=768 &&sidebarOpen && setSidebarOpen(false);
                                }}
                                className="block text-left w-full  py-1 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded"
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => {
              handleLogout();
            }}
            className="flex items-center w-full px-3 py-2 mt-4  rounded text-red-600 hover:bg-red-100"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main panel */}
      <main
    
        className="flex-1 overflow-y-auto pt-7  w-screen min-h-screen bg-gray-50 shadow-inner"
        onClick={() =>
          {setExpandedSubcategory(null);
            setExpandedCategory(null)
            window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false)}
        } // click outside to close
      >
        {renderMainPanel()}
        {activeView == null && (
          <div className=" flex justify-center ">
            <button
              onClick={() => {
                setActiveView("add-product");
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              + Add New Product
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
