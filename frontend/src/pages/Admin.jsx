import AdminDashboard from "../components/AdminDashboard";
import AdminOrdersPage from "../components/AdminOrdersPage";
import AdminProductsPanel from "../components/AdminProductsPanel";
import axios from 'axios'
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
    name: "Bags",
    icon: <ShoppingBag className="mr-2" />,
    subcategories: [
      "Tote Bags",
      "Clutch Bags",
      "Backpacks",
      "Briefcases",
      "Barrel Bags",
      "Travel Bags",
    ],
  },
  {
    name: "Watches",
    icon: <Watch className="mr-2" />,
    subcategories: [
      "Analog",
      "Hybrid",
      "Chronograph",
      "Smart Watches",
      "Pocket",
      "Fitness",
    ],
  },
  {
    name: "Sneakers",
    icon: <Shirt className="mr-2" />,
    subcategories: [
      "Chuck Taylor Shoes",
      "Cross Trainers",
      "Casual Shoes",
      "Formal Shoes",
      "High-Tops Shoes",
      "Limited Edition",
      "Football Cleats",
    ],
  },
  {
    name: "Caps",
    icon: <Tags className="mr-2" />,
    subcategories: ["Beanies", "Visor", "Baseball Caps", "Hats", "Special"],
  },
  {
    name: "Perfumes",
    icon: <Package className="mr-2" />,
    subcategories: [
      "Floral",
      "Oriental",
      "Woody",
      "Aromatic Fougère",
      "Fresh",
      "Luxury",
    ],
  },
  {
    name: "Gifts",
    icon: <Gift className="mr-2" />,
    subcategories: ["Personalized", "For Her", "For Him"],
  },
  {
    name: "Merchandise",
    icon: <Package className="mr-2" />,
    subcategories: ["Hoodies", "Stickers", "Posters"],
  },
];

const Admin = () => {
  const { isMobile } = useContext(MobileResponsivenessContext);

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeView, setActiveView] = useState(
    selectedSubcategory ? "subCategoryProducts" : "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024 ? true : false
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const sidebarRef = useRef();
  const [product, setProduct] = useState(null);
  const backdropRef = useRef();
  const navigate=useNavigate();
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
  const handleLogout=async()=>{
    try{
      const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/logout`,{
        headers:{
           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        }
      })
      if(res.status===200){
        localStorage.removeItem("adminToken"
        );
        navigate("/admin-login");
        alert("Logged out successfully");
      }
    }catch(err){
      console.log(err);
      alert("An error occured while logging out, Please try again later ");
    }
  }
  const renderMainPanel = () => {
    if (activeView === "dashboard") return <AdminDashboard />;
    if (activeView === "orders") return <AdminOrdersPage />;
    if (activeView === "add-product")
      return (
        <AddProductPanel
          selectedSubCategory={selectedSubcategory}
          selectedCategory={selectedCategory}
          setActiveView={setActiveView}
        />
      );
    if (activeView === "update-product") {
      return <UpdateProductPanel product={product} setProduct={setProduct}setActiveView={setActiveView} />;
    }
    if (activeView == "subCategoryProducts" && selectedSubcategory) {
      return (
        <AdminProductsPanel
          setActiveView={setActiveView}
          selectedSubcategory={selectedSubcategory}
          setExpandedCategory={setExpandedCategory}
          product={product}
          setProduct={setProduct}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen p-2 bg-gray-100 relative overflow-hidden">
      <button
        className="absolute top-2 left-2 p-2 bg-white rounded-md shadow lg:hidden z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      {/* Backdrop for mobile */}

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
              setSidebarOpen(false);
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
               window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false)
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
              {expandedCategory === cat.name && (
                <div
                  className={`absolute ${
                    isMobile ? "left-32 w-50" : "left-64 w-72"
                  } top-0 transform transition-all duration-300 ease-out scale-100 opacity-100 translate-y-2 bg-white shadow-xl rounded-lg p-4 z-50  border border-gray-200`}
                >
                  <h3 className="text-md font-semibold mb-3 text-gray-800 border-b pb-1">
                    {cat.name}
                  </h3>
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubcategory(sub);
                        setActiveView("subCategoryProducts");
                         window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false)
                        setExpandedCategory(null);
                      }}
                      className="block text-left w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {sub}
                    </button>
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
          window.innerWidth < 1024 && sidebarOpen && setSidebarOpen(false)
        } // click outside to close
      >
        {renderMainPanel()}
      </main>
    </div>
  );
};

export default Admin;
